import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import * as Faker from 'faker';
import { User } from '../../user/entities/user.entity';

export class CreateUsersTable1732460309839 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'firstName',
            type: 'varchar',
          },
          {
            name: 'lastName',
            type: 'varchar',
          },
          {
            name: 'age',
            type: 'int',
          },
          {
            name: 'gender',
            type: 'varchar',
          },
          {
            name: 'problems',
            type: 'boolean',
            default: false,
          },
        ],
      }),
      true,
    );

    const users = [];
    const BATCH_SIZE = 100000;

    for (let i = 0; i < 1000000; i++) {
      users.push({
        firstName: Faker.name.firstName(),
        lastName: Faker.name.lastName(),
        age: Faker.datatype.number({ min: 18, max: 90 }),
        gender: Faker.helpers.randomize(['Male', 'Female']),
        problems: Faker.datatype.boolean(),
      });

      if (users.length >= BATCH_SIZE) {
        await queryRunner.manager.getRepository(User).save(users);
        users.length = 0;
      }
    }

    if (users.length > 0) {
      await queryRunner.manager.getRepository(User).save(users);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
