import {
  ForbiddenException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { compareSync } from 'bcryptjs';
import { JwtService } from '../jwt/jwt.service';
import { LoginDto } from './dtos/login.dto';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    private readonly _userRepository: UserRepository,

    private readonly _jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginDto) {
    const user = await this._userRepository.existsOrThrow(
      { email },
      new NotFoundException("User doesn't exist."),
    );

    const verified = compareSync(password, user.password);
    if (!verified) {
      throw new ForbiddenException('Invalid credentials.');
    }

    return { token: this._jwtService.getJWT({ email, role: user.role }) };
  }

  async createUser() {}

  async onModuleInit() {
    console.log('UserService initialized');

    await this._userRepository.createSuperUserIfDoesNotExist();
  }
}
