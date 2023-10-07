import { Body, Controller, Post } from '@nestjs/common';
import { UserCreateResponseDto } from './dtos/user.create.response.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  async create(@Body() user: UserCreateResponseDto) {
    await this.userService.create(user);
  }

  @Post('/sqs-send')
  async sqsCreate(@Body() user: UserCreateResponseDto) {
    await this.userService.sqsSend(user);
  }
}
