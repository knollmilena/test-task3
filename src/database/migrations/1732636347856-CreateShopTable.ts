import { faker } from '@faker-js/faker';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateShopTable1732636347856 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE "shop" (
            "id" SERIAL PRIMARY KEY,
            "name" VARCHAR(255) UNIQUE NOT NULL
          );
        `);

    const shops = [];
    for (let i = 0; i < 30; i++) {
      let name = faker.company.name();
      if (!name) {
        name = `Shop_${i}`;
      }

      name = name.replace(/'/g, "''");
      shops.push(`('${name}')`);
    }
    await queryRunner.query(`
          INSERT INTO "shop" ("name") VALUES ${shops.join(', ')}; 
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "shop";');
  }
}
