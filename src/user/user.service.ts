import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(private readonly httpService: HttpService) {}

  async register(createUserDto: CreateUserDto): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('http://94.103.91.4:5000/auth/registration', {
          username: createUserDto.username,
        }),
      );
      return response.data.token;
    } catch (e) {
      throw new HttpException('Попробуйте другое имя', HttpStatus.BAD_REQUEST);
    }
  }

  async login(createUserDto: CreateUserDto): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('http://94.103.91.4:5000/auth/login', {
          username: createUserDto.username,
        }),
      );
      return response.data.token;
    } catch (e) {
      throw new HttpException('Попробуйте другое имя', HttpStatus.BAD_REQUEST);
    }
  }
}
