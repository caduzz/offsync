import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

import { authConfig } from "src/config/auth.config";

type JwtPayload = {
  sub: string;
  email: string;
}

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt'){
  constructor(){
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authConfig.tokens.accessTokenSecret,
    })
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}