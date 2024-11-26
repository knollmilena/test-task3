import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './configs/config.service';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { StockModule } from './stock/stock.module';
import { ShopModule } from './shop/shop.module';
import { HistoryModule } from './history/history.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot(configModuleOptions),
    EventEmitterModule.forRoot(),
    UserModule,
    ProductModule,
    ShopModule,
    StockModule,
    HistoryModule,
  ],
})
export class AppModule {}
