import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { authConfig } from 'src/config/auth.config';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    JwtModule.register({
      secret: authConfig.secret,
      signOptions: authConfig.signOptions,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
