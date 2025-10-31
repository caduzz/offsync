import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { Tokens } from './types';
import { CreateUser } from '@models/user';

import { AtGuard, RtGuard } from '@infra/https/guards';
import { GetCurrentUser, GetCurrentUserId, Public } from '@infra/https/decorators';
import { ApiBearerAuth } from '@nestjs/swagger';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() data: CreateUser): Promise<Tokens> {
    return this.authService.signup(data);
  }
  
  @Public()
  @Post('/local/signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() data: AuthDto): Promise<Tokens> {
    return this.authService.signinLocal({
      email: data.email,
      password: data.password
    });
  }
  
  @UseGuards(AtGuard)
  @ApiBearerAuth('access-token')
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() user_id: string) {
    return this.authService.logout(user_id);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('/refresh')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @GetCurrentUserId() user_id: string,
    @GetCurrentUser('refresh_token') refresh_token: string
  ): Promise<Tokens> {
    return this.authService.refreshToken(user_id, refresh_token);
  }
}
