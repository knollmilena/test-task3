import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Shop } from '../../shop/entities/shop.entity';
import { ActionType } from '../types/action.type';

@Entity('product_history')
@Index('idx_product_history', ['shop', 'product', 'action', 'date'])
export class ProductHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.history)
  product: Product;

  @ManyToOne(() => Shop, (shop) => shop.history, { nullable: true })
  shop: Shop;

  @Column({
    type: 'enum',
    enum: ActionType,
  })
  action: ActionType;

  @CreateDateColumn()
  date: Date;

  @Column({ nullable: true })
  newQuantityInOrder: number;

  @Column({ nullable: true })
  newQuantityOnShelf: number;

  @Column({ nullable: true })
  prevQuantityOnShelf: number;

  @Column({ nullable: true })
  prevQuantityInOrder: number;
}
