import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Shop } from '../../shop/entities/shop.entity';

@Entity('stocks')
@Index('unique_product_shop', ['product', 'shop'], { unique: true })
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantityOnShelf: number;

  @Column()
  quantityInOrder: number;

  @ManyToOne(() => Product, (product) => product.stocks)
  product: Product;

  @ManyToOne(() => Shop, (shop) => shop.stocks)
  shop: Shop;
}
