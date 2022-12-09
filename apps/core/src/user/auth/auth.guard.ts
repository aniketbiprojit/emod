import {
  CanActivate,
  ExecutionContext,
  Global,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { JWTPayload, JwtService } from '../../jwt/jwt.service';
import { RoleEnum } from '../entities/user-role.enum';

type RequestWithUser = Request & { user: JWTPayload };

@Global()
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly _jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<RoleEnum[]>('roles', context.getHandler());

    if (context.getType() === 'http') {
      const req: RequestWithUser = context.switchToHttp().getRequest();
      const authorization = req.headers.authorization;
      if (!authorization) {
        return false;
      }

      const token = authorization.split(' ')[1];
      if (!token) {
        return false;
      }

      try {
        req.user = this._jwtService.verifyJWT(token);
        if (!roles) {
          return true;
        }

        if (roles.includes(req.user.role)) {
          return true;
        }
        return false;
      } catch (err) {
        if (!(err instanceof JsonWebTokenError)) {
          console.error(err);
        }
        return false;
      }
    }
    return false;
  }
}

export const Roles = (...roles: RoleEnum[]) => SetMetadata('roles', roles);
