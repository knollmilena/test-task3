import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsNumber, IsString, IsInt } from 'class-validator';

export class FilterStockDto {
  @ApiProperty({
    description: 'Артикул товара (PLU)',
    example: '445ghs43jb33',
    required: false,
  })
  @IsOptional()
  @IsString()
  plu?: string;

  @ApiProperty({
    description: 'ID магазина',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  shopId?: number;

  @ApiProperty({
    description: 'Минимальное количество на полке',
    example: 10,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  quantityOnShelfMin?: number;

  @ApiProperty({
    description: 'Максимальное количество на полке',
    example: 100,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  quantityOnShelfMax?: number;

  @ApiProperty({
    description: 'Минимальное количество в заказе',
    example: 5,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  quantityInOrderMin?: number;

  @ApiProperty({
    description: 'Максимальное количество в заказе',
    example: 50,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  quantityInOrderMax?: number;
}
