import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (user) {
      const comparePassword = await this.userService.comparePasswords(password, user.password);
      if(comparePassword){
        const payload = { username: user.username, sub: user.id };
        return { access_token: this.jwtService.sign(payload) };
      }
    }
    return null;
  }
}