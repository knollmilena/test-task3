import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Shop } from './entities/shop.entity';

@ApiTags('Магазины')
@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @ApiOperation({ summary: 'получить все магазины' })
  @Get()
  async getAll(): Promise<Shop[]> {
    return this.shopService.getAll();
  }

  @ApiOperation({ summary: 'получить магазин по id' })
  @Get(':id')
  get(@Param('id') id: string) {
    return this.shopService.getById(id);
  }

  @ApiOperation({ summary: 'создать магазин' })
  @Post()
  create(@Body() dto: CreateShopDto) {
    return this.shopService.create(dto);
  }
}
