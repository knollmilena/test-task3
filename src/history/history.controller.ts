import { Controller, Get, Query } from '@nestjs/common';
import { HistoryService } from './history.service';
import { ApiOperation } from '@nestjs/swagger';
import { FilterHistoryDto } from './dto/filter-history.dto';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @ApiOperation({ summary: 'получить историю изменений' })
  @Get()
  async getAll(@Query() filters: FilterHistoryDto) {
    return this.historyService.getAll(filters);
  }
}
