import { Injectable } from '@nestjs/common';
import { RoleEnum } from '../user/entities/user-role.enum';
import { sign, verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

type JWTPayload = {
  email: string;
  role: RoleEnum;
};

@Injectable()
export class JwtService {
  constructor(private readonly _configService: ConfigService) {}

  getJWT(data: JWTPayload) {
    return sign(data, this._configService.get<string>('JWT_SECRET'));
  }

  verifyJWT(token: string) {
    return verify(
      token,
      this._configService.get<string>('JWT_SECRET'),
    ) as JWTPayload;
  }
}
