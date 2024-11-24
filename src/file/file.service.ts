import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class FileService {
  constructor(
    private readonly userService: UserService,
    private readonly httpService: HttpService,
  ) {}
  async createTable(username: CreateUserDto, res) {
    let token;
    try {
      token = await this.userService.login(username);
    } catch (loginError) {
      try {
        token = await this.userService.register(username);
      } catch (registrationError) {
        throw new Error('Не удалось ни зарегистрировать, ни войти.');
      }
    }
    if (token) {
      try {
        const users = await this.getUserFromServer(token);
        return await this.createXls(users, res);
      } catch (e) {
        throw new Error('Не удалось получить данные пользователя с сервера.');
      }
    }
  }

  async getUserFromServer(token: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get('http://94.103.91.4:5000/clients', {
          headers: {
            Authorization: `${token}`,
          },
        }),
      );
      const users = response.data;
      const userIds = response.data.map((user) => user.id);
      const statuses = await this.getStatusUser(userIds, token);

      const result = users.map((user) => {
        const statusObj = statuses.find((status) => status.id === user.id);
        return { ...user, status: statusObj ? statusObj.status : 'Unknown' };
      });
      return result;
    } catch (e) {
      throw new HttpException(
        'Информация доступна только авторизированным пользователям',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getStatusUser(ids: number[], token) {
    const response = await firstValueFrom(
      this.httpService.post(
        'http://94.103.91.4:5000/clients',
        { userIds: ids },
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      ),
    );
    return response.data;
  }

  async createXls(users, res: Response) {
    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet('Users');

    const headers = [
      'id',
      'firstName',
      'lastName',
      'gender',
      'address',
      'city',
      'phone',
      'email',
      'status',
    ];

    worksheet.addRow(headers);

    users.forEach((user) => {
      worksheet.addRow([
        user.id,
        user.firstName,
        user.lastName,
        user.gender,
        user.address,
        user.city,
        user.phone,
        user.email,
        user.status,
      ]);
    });

    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        if (cell.value && cell.value.toString().length > maxLength) {
          maxLength = cell.value.toString().length;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength;
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename="users.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
  }
}
