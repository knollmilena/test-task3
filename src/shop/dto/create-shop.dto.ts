import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateShopDto {
  @ApiProperty({
    description: 'наименование магазина',
    example: 'На Крупской',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
