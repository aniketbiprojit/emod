import { IsEnum, IsIn, IsNotIn, IsString } from 'class-validator';
import { RoleEnum } from '../entities/user-role.enum';
import { PaginationQueryDTO } from './pagination.dto';

export class UserQueryDTO extends PaginationQueryDTO {
  @IsString()
  @IsIn(Object.values(RoleEnum))
  @IsNotIn([RoleEnum.SuperAdmin])
  role: Exclude<RoleEnum, RoleEnum.SuperAdmin>;
}
