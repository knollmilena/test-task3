import { Controller, Post, Body, Res } from '@nestjs/common';
import { FileService } from './file.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Response } from 'express';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  create(@Body() createFileDto: CreateUserDto, @Res() res: Response) {
    return this.fileService.createTable(createFileDto, res);
  }
}
