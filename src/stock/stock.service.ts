import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { ShopService } from '../shop/shop.service';
import { ProductService } from '../product/product.service';
import { UpdateStockDto } from './dto/update-stock.dto';
import { FilterStockDto } from './dto/filter.dto';
import { ActionType } from '../history/types/action.type';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventType } from '../history/types/event.type';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
    private readonly shopService: ShopService,
    private readonly productService: ProductService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getAll(filter: FilterStockDto): Promise<Stock[]> {
    const {
      plu,
      shopId,
      quantityOnShelfMin,
      quantityOnShelfMax,
      quantityInOrderMin,
      quantityInOrderMax,
    } = filter;

    const queryBuilder = this.stockRepository
      .createQueryBuilder('stock')
      .leftJoinAndSelect('stock.product', 'product')
      .leftJoinAndSelect('stock.shop', 'shop');

    if (plu) {
      queryBuilder.andWhere('product.plu LIKE :plu', { plu: `%${plu}%` });
    }

    if (shopId) {
      queryBuilder.andWhere('shop.id = :shopId', { shopId });
    }

    if (quantityOnShelfMin !== undefined) {
      queryBuilder.andWhere('stock.quantityOnShelf >= :quantityOnShelfMin', {
        quantityOnShelfMin,
      });
    }

    if (quantityOnShelfMax !== undefined) {
      queryBuilder.andWhere('stock.quantityOnShelf <= :quantityOnShelfMax', {
        quantityOnShelfMax,
      });
    }

    if (quantityInOrderMin !== undefined) {
      queryBuilder.andWhere('stock.quantityInOrder >= :quantityInOrderMin', {
        quantityInOrderMin,
      });
    }

    if (quantityInOrderMax !== undefined) {
      queryBuilder.andWhere('stock.quantityInOrder <= :quantityInOrderMax', {
        quantityInOrderMax,
      });
    }

    return await queryBuilder.getMany();
  }

  async getById(id): Promise<Stock> {
    const stock = await this.stockRepository.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!stock) {
      throw new NotFoundException('Stock not found');
    }
    return stock;
  }

  async create(dto: CreateStockDto) {
    try {
      const product = await this.productService.getById(dto.productId);
      const shop = await this.shopService.getById(dto.shopID);
      let stock = this.stockRepository.create({
        quantityOnShelf: dto.quantityOnShelf,
        quantityInOrder: dto.quantityInOrder,
        shop,
        product,
      });
      stock = await this.stockRepository.save(stock);

      this.eventEmitter.emit(
        ActionType.STOCK_CREATED,
        stock,
        shop.id,
        product.id,
      );

      return stock;
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException(
          `Остаток этого товара в магазине ${dto.shopID} уже существует. Если остаток нужно обновить, воспользуйтесь другим методом.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }
  }

  async partialUpdate(dto: UpdateStockDto) {
    const stock = await this.getById(dto.id);

    const oldOnShelf = stock.quantityOnShelf;
    const oldInOrder = stock.quantityInOrder;

    if (dto.quantityOnShelf !== undefined) {
      const newOnShelf = dto.quantityOnShelf;
      stock.quantityOnShelf = newOnShelf;

      if (newOnShelf > oldOnShelf) {
        this.eventEmitter.emit(
          EventType.STOCK_ON_INCREASED,
          oldOnShelf,
          newOnShelf,
          ActionType.STOCK_ON_SHELF_INCREASED,
          stock.product.id,
        );
      } else if (newOnShelf < oldOnShelf) {
        this.eventEmitter.emit(
          EventType.STOCK_ON_DECREASED,
          oldOnShelf,
          newOnShelf,
          ActionType.STOCK_ON_SHELF_DECREASED,
          stock.product.id,
        );
      }
    }

    if (dto.quantityInOrder !== undefined) {
      const newInOrder = dto.quantityInOrder;
      stock.quantityInOrder = newInOrder;

      if (newInOrder > oldInOrder) {
        this.eventEmitter.emit(
          EventType.STOCK_ON_INCREASED,
          oldInOrder,
          newInOrder,
          ActionType.STOCK_IN_ORDER_INCREASED,
          stock.product.id,
        );
      } else if (newInOrder < oldInOrder) {
        this.eventEmitter.emit(
          EventType.STOCK_ON_DECREASED,
          oldInOrder,
          newInOrder,
          ActionType.STOCK_ON_SHELF_DECREASED,
          stock.product.id,
        );
      }
    }

    return await this.stockRepository.save(stock);
  }

  findAll() {
    return `This action returns all stock`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stock`;
  }

  remove(id: number) {
    return `This action removes a #${id} stock`;
  }
}
