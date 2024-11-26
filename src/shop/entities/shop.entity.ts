import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Stock } from '../../stock/entities/stock.entity';
import { ProductHistory } from '../../history/entities/history.entity';

@Entity('shop')
export class Shop {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @OneToMany(() => Stock, (stock) => stock.shop)
  stocks: Stock[];

  @OneToMany(() => ProductHistory, (history) => history.shop)
  history: ProductHistory[];
}
