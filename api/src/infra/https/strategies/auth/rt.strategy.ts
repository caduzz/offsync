import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy, ExtractJwt } from "passport-jwt";

import { authConfig } from "src/config/auth.config";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh'){
  constructor(){
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authConfig.tokens.refreshTokenSecret,
      passReqToCallback: true,
    })
  }

  validate(req: Request, payload: any) {
    const refresh_token = req.get('Authorization').replace('Bearer ', '');

    return {
      ...payload,
      refresh_token,
    };
  }
}