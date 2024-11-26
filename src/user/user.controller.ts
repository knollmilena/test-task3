import { Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Пользователи')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'избавить пользователей от проблем' })
  @Post('reset-problems')
  create() {
    return this.userService.resetProblems();
  }
}
