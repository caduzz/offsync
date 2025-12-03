import { Controller, Get, UseGuards } from '@nestjs/common';

import { User } from 'src/models/user';
import { AtGuard } from '@infra/https/guards';
import { GetCurrentUserId } from '@infra/https/decorators';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { Serializer } from '@infra/https/interceptors/serializer/serializer.decorator';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AtGuard)
  @ApiBearerAuth('access-token')
  @Get('/')
  @Serializer(User)
  getUser(@GetCurrentUserId() user_id: string) {
    return this.userService.findById(user_id);
  }
}
