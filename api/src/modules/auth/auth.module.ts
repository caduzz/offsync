import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { UserService } from '../user/user.service';
import { AtStrategy, RtStrategy } from '@infra/https/strategies/auth';
import { JwtModule } from '@nestjs/jwt';
import { authConfig } from 'src/config/auth.config';

@Module({
  imports: [
    JwtModule.register({
      secret: authConfig.tokens.accessTokenSecret,
      signOptions: authConfig.signOptions,
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, AtStrategy, RtStrategy],
})
export class AuthModule {}
