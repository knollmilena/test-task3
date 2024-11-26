import { MigrationInterface, QueryRunner } from 'typeorm';
import { faker } from '@faker-js/faker';

export class CreateStockTable1732640536436 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE "stocks" (
            "id" SERIAL PRIMARY KEY,
            "quantityOnShelf" INT NOT NULL,
            "quantityInOrder" INT NOT NULL,
            "productId" INT,
            "shopId" INT,
            CONSTRAINT "FK_product" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE,
            CONSTRAINT "FK_shop" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE CASCADE,
            CONSTRAINT "unique_product_shop" UNIQUE ("productId", "shopId")
          );
        `);

    const productIds = await queryRunner.query('SELECT id FROM "products"');
    const shopIds = await queryRunner.query('SELECT id FROM "shop"');

    const usedPairs = new Set<string>();

    const stocks = [];

    for (let i = 0; i < 30; i++) {
      let randomProductId;
      let randomShopId;
      let pairKey;

      do {
        randomProductId =
          productIds[Math.floor(Math.random() * productIds.length)].id;
        randomShopId = shopIds[Math.floor(Math.random() * shopIds.length)].id;

        pairKey = `${randomProductId}-${randomShopId}`;
      } while (usedPairs.has(pairKey));

      usedPairs.add(`${randomProductId}-${randomShopId}`);

      const quantityOnShelf = faker.number.int({ min: 0, max: 100 });
      const quantityInOrder = faker.number.int({ min: 0, max: 100 });

      stocks.push(
        `(${quantityOnShelf}, ${quantityInOrder}, ${randomProductId}, ${randomShopId})`,
      );
    }

    await queryRunner.query(`
          INSERT INTO "stocks" ("quantityOnShelf", "quantityInOrder", "productId", "shopId")
          VALUES ${stocks.join(', ')};
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS "stocks";');
  }
}
