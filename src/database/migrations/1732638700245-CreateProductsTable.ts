import { MigrationInterface, QueryRunner } from 'typeorm';
import { faker } from '@faker-js/faker';

export class CreateProductsTable1732638700245 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE "products" (
            "id" SERIAL PRIMARY KEY,
            "plu" VARCHAR(255) UNIQUE NOT NULL,
            "name" VARCHAR(255) NOT NULL
          );
        `);

    const products = [];
    for (let i = 0; i < 30; i++) {
      const plu = faker.string.alphanumeric(10);
      const name = faker.commerce.productName();

      const escapedName = name.replace(/'/g, "''");

      products.push(`('${plu}', '${escapedName}')`);
    }

    await queryRunner.query(`
          INSERT INTO "products" ("plu", "name") VALUES ${products.join(', ')}; 
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS "products";');
  }
}
