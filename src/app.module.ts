import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './config/config.service';

@Module({
  imports: [DatabaseModule, ConfigModule.forRoot(configModuleOptions)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
