import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard, Roles } from '../user/auth/auth.guard';
import { RoleEnum } from '../user/entities/user-role.enum';
import { InitializeFormDTO } from './dtos/initialize-mod-form.dto';

@Controller('form')
export class FormController {
  @Post('/create')
  @UseGuards(AuthGuard)
  @Roles(RoleEnum.AdminOfficer, RoleEnum.SuperAdmin)
  create(@Body() body: InitializeFormDTO) {
    return body;
  }
}
