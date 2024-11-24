import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './config/config.service';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    // DatabaseModule,
    // ConfigModule.forRoot(configModuleOptions),
    UserModule,
    FileModule,
  ],
})
export class AppModule {}
