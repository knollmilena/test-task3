import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async resetProblems() {
    const result = await this.userRepository.query(`
      UPDATE "user"
      SET "problems" = false
      WHERE "problems" = true
      RETURNING COUNT(*) AS updatedCount;
    `);

    return {
      message: 'Проблемы всех пользователей обнулились в один миг :D',
      countWithProblemsTrue: `Они были обнаружены у ${result.COUNT} человек`,
    };
  }
}
