import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Тестовое задание для Effective Mobile')
  .setDescription('Первое и второе задание в одном проекте')
  .setVersion('1.0')
  .build();
