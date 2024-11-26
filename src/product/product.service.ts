import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Like, QueryFailedError, Repository } from 'typeorm';
import { FilterProductDto } from './dto/filter-get-products.dto';
import { ActionType } from '../history/types/action.type';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getAll(dto: FilterProductDto): Promise<{
    products: Product[];
    totalCount: number;
    totalPages: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, name, plu } = dto;
    const filterConditions: any = {};
    const offset = (page - 1) * limit;

    if (name) {
      filterConditions.name = Like(`%${name}%`);
    }

    if (plu) {
      filterConditions.plu = plu;
    }

    const [products, totalCount] = await this.productRepository.findAndCount({
      where: filterConditions,
      skip: offset,
      take: limit,
    });

    return {
      products,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    };
  }

  async getById(id) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async create(dto: CreateProductDto) {
    try {
      let product = await this.productRepository.create(dto);
      product = await this.productRepository.save(product);

      this.eventEmitter.emit(ActionType.PRODUCT_CREATED, product);

      return product;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.code === '23505') {
          throw new HttpException(
            'Продукт с таким PLU уже существует',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      throw error;
    }
  }
}
