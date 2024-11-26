import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateStockDto {
  @ApiProperty({
    description: 'количество товара на полке',
    example: 783,
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  quantityOnShelf: number;

  @ApiProperty({
    description: 'количество товара в заказе',
    example: 72,
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  quantityInOrder: number;

  @ApiProperty({
    description: 'id продукта, к которому отностся продукты',
    example: 7,
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @ApiProperty({
    description: 'id магазина, для которого актуален остаток',
    example: 9,
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  shopID: number;
}
