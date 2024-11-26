import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from './entities/shop.entity';
import { CreateShopDto } from './dto/create-shop.dto';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
  ) {}

  async getAll() {
    return await this.shopRepository.find();
  }

  async getById(id) {
    const shop = await this.shopRepository.findOne({ where: { id } });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }
    return shop;
  }

  async create(dto: CreateShopDto) {
    const product = await this.shopRepository.create(dto);
    return this.shopRepository.save(product);
  }
}
