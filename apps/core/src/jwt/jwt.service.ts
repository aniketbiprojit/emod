import { Injectable } from '@nestjs/common';
import { RoleEnum } from '../user/entities/user-role.enum';
import { sign, verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

export type JWTPayload = {
  email: string;
  role: RoleEnum;
  _id: string;
};

@Injectable()
export class JwtService {
  constructor(private readonly _configService: ConfigService) {}

  getJWT(data: JWTPayload) {
    return sign(data, this._configService.get<string>('JWT_SECRET'), {
      expiresIn: '1d',
    });
  }

  verifyJWT(token: string) {
    return verify(
      token,
      this._configService.get<string>('JWT_SECRET'),
    ) as JWTPayload;
  }
}
