import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { MongooseClassSerializerInterceptor } from '../interceptors/mongoose-class.interceptor';
import { AuthGuard, Roles, UserParam } from '../user/auth/auth.guard';
import { PaginationQueryDTO } from '../user/dtos/pagination.dto';
import { RoleEnum } from '../user/entities/user-role.enum';
import { User } from '../user/entities/user.entity';
import { CreatedFormsDTO } from './dtos/created-form.dto';
import { GetFormDTO } from './dtos/get-form.dto';
import { InitializeFormDTO } from './dtos/initialize-mod-form.dto';
import { UpdateStateDTO } from './dtos/update-state.dto';
import { Form } from './entities/form.entitiy';
import { FormService } from './form.service';
import { CanUpdateFormGuard } from './guards/form.guard';

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
  @MongooseClassSerializerInterceptor(CreatedFormsDTO)
  async get(@Query() query: any) {
    return await this._formService.getForms(query);
  }

  @Get('/:id')
  @UseGuards(AuthGuard, CanUpdateFormGuard)
  @MongooseClassSerializerInterceptor(GetFormDTO)
  async getById(@Param('id') id: string) {
    return await this._formService.getFormById(id);
  }

  @Put('/:id')
  @UseGuards(AuthGuard, CanUpdateFormGuard)
  @MongooseClassSerializerInterceptor(GetFormDTO)
  async updateState(
    @UserParam() updatedBy: User,
    @Param('id') id: string,
    @Body() data: UpdateStateDTO,
  ) {
    return await this._formService.updateState(id, data.toUser, updatedBy);
  }
}
