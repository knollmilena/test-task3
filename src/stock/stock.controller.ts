import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateStockDto } from './dto/update-stock.dto';
import { FilterStockDto } from './dto/filter.dto';
import { Stock } from './entities/stock.entity';

@ApiTags('Сток')
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @ApiOperation({ summary: 'получить все остатки' })
  @Get()
  async getAll(@Query() filterDto: FilterStockDto): Promise<Stock[]> {
    return this.stockService.getAll(filterDto);
  }

  @ApiOperation({ summary: 'получить сток по id' })
  @Get(':id')
  get(@Param('id') id: string) {
    return this.stockService.getById(id);
  }

  @ApiOperation({ summary: 'создать сток' })
  @Post()
  create(@Body() createStockDto: CreateStockDto) {
    return this.stockService.create(createStockDto);
  }

  @ApiOperation({ summary: 'увеличение или уменьшение остатка' })
  @Patch()
  partialUpdate(@Body() dto: UpdateStockDto) {
    return this.stockService.partialUpdate(dto);
  }
}
