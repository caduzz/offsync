import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Tokens } from './types';
import { authConfig } from 'src/config/auth.config';

import { AuthDto } from './auth.dto';
import { BadRequestError } from 'src/errors/BadRequestError';
import { ForbiddenError } from 'src/errors/ForbiddenError';
import { AuthPayload } from 'src/models/auth';
import { CreateUser } from 'src/models/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async getTokens({ user_id, email }: AuthPayload): Promise<Tokens> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync({
        sub: user_id,
        email
      }, {
        secret: authConfig.tokens.accessTokenSecret,
        expiresIn: authConfig.tokens.expiresInAccess,
      }),
      this.jwtService.signAsync({
        sub: user_id,
        email
      }, {
        secret: authConfig.tokens.refreshTokenSecret,
        expiresIn: authConfig.tokens.expiresInRefresh,
      }),
    ]);

    return { access_token, refresh_token };
  }

  async signup({ email, password, username }: CreateUser): Promise<Tokens> {
    const user = await this.userService.findByEmail(email);
    if (user) {
      throw new BadRequestError('User already exists');
    }

    const newUser = await this.userService.create({
      email,
      password,
      username,
    });

    if(newUser) {
      const tokens = await this.getTokens({
        user_id: newUser.id,
        email: newUser.email
      });
      await this.userService.updateRtHash(newUser.id, tokens.refresh_token);
      return tokens;
    }

  }

  async signinLocal({ email, password }: AuthDto): Promise<Tokens> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new ForbiddenError('Invalid credentials', "ACCESS_DENIED");
    }

    const compareHashedPassword = await this.userService.compareHashedData(password, user.password);
    if(!compareHashedPassword){
      throw new ForbiddenError('Invalid credentials', "ACCESS_DENIED");
    }

    const tokens = await this.getTokens({
      user_id: user.id,
      email: user.email
    });
    await this.userService.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(user_id: string): Promise<any> {
    const data = await this.userService.clearRtHash(user_id);
    if (!data) {
      throw new BadRequestError('Logout failed');
    }
  }

  async refreshToken(user_id: string, refresh_token: string): Promise<any> {
    const user = await this.userService.findById(user_id);
    if (!user) {
      throw new ForbiddenError('Invalid credentials', "ACCESS_DENIED");
    }

    const compareHashedRt = await this.userService.compareHashedData(refresh_token, user.hashed_rt);
    if (!compareHashedRt) {
      throw new ForbiddenError('Invalid credentials', "ACCESS_DENIED");
    }

    const tokens = await this.getTokens({
      user_id: user.id,
      email: user.email
    });
    await this.userService.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }
}