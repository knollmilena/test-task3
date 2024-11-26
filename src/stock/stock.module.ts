import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { ProductModule } from '../product/product.module';
import { ShopModule } from '../shop/shop.module';

@Module({
  imports: [TypeOrmModule.forFeature([Stock]), ProductModule, ShopModule],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
