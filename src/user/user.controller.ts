import { Body, Controller, Post } from '@nestjs/common';
import { UserCreateRequestDto } from './dtos/user.create.request.dto';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserCreateResponseDto } from './dtos/user.create.response.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  @ApiOperation({
    summary: 'Create a new user',
  })
  @ApiResponse({
    description: 'Result of the user creation',
    type: UserCreateResponseDto,
  })
  async create(@Body() user: UserCreateRequestDto) {
    await this.userService.create(user);
  }

  @Post('/sqs-send')
  @ApiOperation({
    summary: 'Create a new user through SQS',
  })
  async sqsCreate(@Body() user: UserCreateRequestDto) {
    await this.userService.sqsSend(user);
  }
}
