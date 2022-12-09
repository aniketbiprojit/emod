import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compareSync } from 'bcryptjs';
import { CoreEnv } from '../environment';
import { JwtService } from '../jwt/jwt.service';
import { CreateUserDTO } from './dtos/create.dto';
import { LoginDto } from './dtos/login.dto';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    private configService: ConfigService,
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

    return {
      token: this._jwtService.getJWT({
        email,
        role: user.role,
        _id: user._id.toString(),
      }),
    };
  }

  async createUser(user: CreateUserDTO) {
    const fetched = await this._userRepository.exists({ email: user.email });

    if (fetched !== null) {
      throw new BadRequestException('User already exists.');
    }
    return await this._userRepository.createUser(user);
  }

  async onModuleInit() {
    console.log(
      'UserService initialized',
      this.configService.get(CoreEnv.MONGO_URI),
    );

    await this._userRepository.createSuperUserIfDoesNotExist();
  }
}
