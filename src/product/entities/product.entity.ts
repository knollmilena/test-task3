import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Stock } from '../../stock/entities/stock.entity';
import { ProductHistory } from '../../history/entities/history.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  plu: string;

  @Column()
  name: string;

  @OneToMany(() => Stock, (stock) => stock.product, { nullable: true })
  stocks: Stock[];

  @OneToMany(() => ProductHistory, (history) => history.product)
  history: ProductHistory[];
}
