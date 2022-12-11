import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { MongooseClassSerializerInterceptor } from '../interceptors/mongoose-class.interceptor';
import { AuthGuard, Roles, UserParam } from '../user/auth/auth.guard';
import { PaginationQueryDTO } from '../user/dtos/pagination.dto';
import { RoleEnum } from '../user/entities/user-role.enum';
import { User } from '../user/entities/user.entity';
import { CreatedFormDTO } from './dtos/created-form.dto';
import { InitializeFormDTO } from './dtos/initialize-mod-form.dto';
import { FormService } from './form.service';

@Controller('form')
export class FormController {
  constructor(private readonly _formService: FormService) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  @Roles(RoleEnum.AdminOfficer, RoleEnum.SuperAdmin)
  create(@UserParam() user: User, @Body() body: InitializeFormDTO) {
    return this._formService.initializeForm(body, user);
  }

  @Get('/')
  @UseGuards(AuthGuard)
  @MongooseClassSerializerInterceptor(CreatedFormDTO)
  async get(@Query() query: any) {
    return await this._formService.getForms(query);
  }
}
