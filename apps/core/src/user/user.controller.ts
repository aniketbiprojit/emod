import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { MongooseClassSerializerInterceptor } from '../interceptors/mongoose-class.interceptor';
import { AuthGuard, Roles } from './auth/auth.guard';
import { CreateUserDTO } from './dtos/create.dto';
import { LoginDto } from './dtos/login.dto';
import { RoleEnum } from './entities/user-role.enum';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post('login')
  async login(@Body() data: LoginDto): Promise<{
    token: string;
  }> {
    return await this._userService.login(data);
  }

  @Post('create')
  @UseGuards(AuthGuard)
  @Roles(RoleEnum.SuperAdmin)
  @MongooseClassSerializerInterceptor(CreateUserDTO)
  async create(@Body() user: CreateUserDTO) {
    return await this._userService.createUser(user);
  }

  @Get('users')
  @UseGuards(AuthGuard)
  async users(@Query('role') role: Exclude<RoleEnum, RoleEnum.SuperAdmin>) {}
}
