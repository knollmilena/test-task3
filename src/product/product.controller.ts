import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Product } from './entities/product.entity';
import { FilterProductDto } from './dto/filter-get-products.dto';

@ApiTags('Продукт')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'получить все продукты' })
  @Get()
  async getAll(
    @Query() filters: FilterProductDto,
  ): Promise<{ products: Product[]; totalCount: number }> {
    return this.productService.getAll(filters);
  }

  @ApiOperation({ summary: 'создать продукт' })
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }
}
