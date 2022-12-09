import { Global, Injectable } from '@nestjs/common';
import { RoleEnum } from '../user/entities/user-role.enum';
import { sign, verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { CoreEnv } from '../environment';

export type JWTPayload = {
  email: string;
  role: RoleEnum;
  _id: string;
};

@Global()
@Injectable()
export class JwtService {
  constructor(private readonly _configService: ConfigService) {}

  getJWT(data: JWTPayload) {
    return sign(data, this._configService.get<string>(CoreEnv.JWT_SECRET), {
      expiresIn: '1d',
    });
  }

  verifyJWT(token: string) {
    return verify(
      token,
      this._configService.get<string>(CoreEnv.JWT_SECRET),
    ) as JWTPayload;
  }
}
