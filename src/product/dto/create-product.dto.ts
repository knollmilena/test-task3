import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'артикул товара',
    example: '445ghs43jb33',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  plu: string;

  @ApiProperty({
    description: 'наименование товара',
    example: 'Монитор LG',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
