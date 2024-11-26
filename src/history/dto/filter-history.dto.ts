import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsInt,
  IsString,
  IsDateString,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { ActionType } from '../types/action.type';

export class FilterHistoryDto {
  @ApiProperty({
    description: 'id магазина',
    example: 3,
    nullable: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  shopId?: number;

  @ApiProperty({
    description: 'артикул товара',
    example: '445ghs43jb33',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString()
  plu?: string;

  @ApiProperty({
    description: 'Дата с',
    example: '2024-11-27T01:40:30.000+0300',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'Дата с',
    example: '2024-11-27T01:40:30.000+0300',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Тип действия, которое нужно отфильтровать',
    enum: ActionType,
    required: false,
  })
  @IsOptional()
  @IsEnum(ActionType)
  action?: ActionType;

  @ApiProperty({
    description: 'число страницы, элементы которой надо вренуть',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  page?: number;

  @ApiProperty({
    description: 'число страницы элементов на одной странице',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  limit?: number;
}
