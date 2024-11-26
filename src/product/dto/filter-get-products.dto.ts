import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterProductDto {
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
    description: 'наименование товара',
    example: 'Монитор LG',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

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
