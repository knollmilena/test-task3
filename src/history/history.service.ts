import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { ActionType } from './types/action.type';
import { Stock } from '../stock/entities/stock.entity';
import { ProductHistory } from './entities/history.entity';
import { EventType } from './types/event.type';
import { FilterHistoryDto } from './dto/filter-history.dto';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(ProductHistory)
    private historyRepository: Repository<ProductHistory>,
  ) {}

  async getAll(filters: FilterHistoryDto) {
    const {
      shopId,
      plu,
      startDate,
      endDate,
      action,
      limit = 10,
      page = 1,
    } = filters;

    const query = this.historyRepository
      .createQueryBuilder('history')
      .leftJoinAndSelect('history.product', 'product')
      .leftJoinAndSelect('history.shop', 'shop');

    if (shopId) {
      query.andWhere('history.shopId = :shopId', { shopId });
    }

    if (plu) {
      query.andWhere('product.plu = :plu', { plu });
    }

    if (startDate) {
      query.andWhere('history.date >= :startDate', {
        startDate: new Date(startDate),
      });
    }
    if (endDate) {
      query.andWhere('history.date <= :endDate', {
        endDate: new Date(endDate),
      });
    }

    if (action) {
      query.andWhere('history.action = :action', { action });
    }

    query.skip((page - 1) * limit).take(limit);

    const [results, total] = await query.getManyAndCount();

    return {
      data: results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  @OnEvent(ActionType.PRODUCT_CREATED)
  async createProduct(product) {
    const history = new ProductHistory();
    history.action = ActionType.PRODUCT_CREATED;
    history.product = product;

    await this.historyRepository.save(history);
  }

  @OnEvent(ActionType.STOCK_CREATED)
  async createStock(stock: Stock, shopId, productId) {
    const history = await this.historyRepository.create();

    history.action = ActionType.STOCK_CREATED;
    history.newQuantityInOrder = stock.quantityInOrder;
    history.newQuantityOnShelf = stock.quantityOnShelf;
    history.shop = shopId;
    history.product = productId;

    await this.historyRepository.save(history);
  }
  @OnEvent(EventType.STOCK_ON_INCREASED)
  async increasedOnShelf(oldValue, newValue, shelfOrOrder, productId) {
    const history = await this.historyRepository.create();

    if (shelfOrOrder === ActionType.STOCK_ON_SHELF_INCREASED) {
      history.action = ActionType.STOCK_ON_SHELF_INCREASED;
    } else {
      history.action = ActionType.STOCK_IN_ORDER_INCREASED;
    }
    history.prevQuantityOnShelf = oldValue;
    history.newQuantityOnShelf = newValue;
    history.product = productId;

    await this.historyRepository.save(history);
  }

  @OnEvent(EventType.STOCK_ON_DECREASED)
  async increasedOnOrder(oldValue, newValue, shelfOrOrder, productId) {
    const history = await this.historyRepository.create();

    if (shelfOrOrder === ActionType.STOCK_ON_SHELF_DECREASED) {
      history.action = ActionType.STOCK_ON_SHELF_DECREASED;
    } else {
      history.action = ActionType.STOCK_IN_ORDER_DECREASED;
    }

    history.prevQuantityInOrder = oldValue;
    history.newQuantityInOrder = newValue;
    history.product = productId;

    await this.historyRepository.save(history);
  }
}
