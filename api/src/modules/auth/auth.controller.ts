import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/')
  login(@Body() data: { username: string; password: string }) {
    return this.authService.login(data.username, data.password);
  }
}
