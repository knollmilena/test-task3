import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHistoryTable1732650283175 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'action_type_enum') THEN
            CREATE TYPE "action_type_enum" AS ENUM (
              'product_created',
              'product_updated',
              'stock_created',
              'stock_on_shelf_increased', 
              'stock_on_shelf_decreased',  
              'stock_in_order_increased', 
              'stock_in_order_decreased'   
            );
          END IF;
        END $$;
    `);

    await queryRunner.query(`
          CREATE TABLE "product_history" (
            "id" SERIAL PRIMARY KEY,
            "productId" INT NOT NULL,
            "shopId" INT,
            "action" "action_type_enum" NOT NULL,
            "date" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            "newQuantityInOrder" INT,
            "newQuantityOnShelf" INT,
            "prevQuantityOnShelf" INT,
            "prevQuantityInOrder" INT,
            CONSTRAINT "fk_product_history_product" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE,
            CONSTRAINT "fk_product_history_shop" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE CASCADE,
            CONSTRAINT "idx_product_history" UNIQUE ("shopId", "productId", "action", "date")
          );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS "product_history"');
    await queryRunner.query('DROP TYPE IF EXISTS "action_type_enum"');
  }
}
