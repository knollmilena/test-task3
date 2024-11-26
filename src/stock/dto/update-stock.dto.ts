import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateStockDto {
  @ApiProperty({
    description: 'id стока, который нужно обновить',
    example: 7,
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'количество товара на полке',
    example: 783,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  quantityOnShelf?: number;

  @ApiProperty({
    description: 'количество товара в заказе',
    example: 72,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  quantityInOrder?: number;
}
