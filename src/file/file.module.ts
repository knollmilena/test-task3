import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { UserModule } from '../user/user.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [UserModule, HttpModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
