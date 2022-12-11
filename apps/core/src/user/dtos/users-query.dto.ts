import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsIn, IsNotIn, IsString } from 'class-validator';
import { RoleEnum } from '../entities/user-role.enum';
import { PaginationQueryDTO } from './pagination.dto';

export class UserQueryDTO extends PaginationQueryDTO {
  @Transform(({ value }) => value?.split(','))
  @IsArray()
  @IsIn(Object.values(RoleEnum), {
    each: true,
  })
  @IsNotIn([RoleEnum.SuperAdmin], {
    each: true,
  })
  role: Exclude<RoleEnum, RoleEnum.SuperAdmin>;
}
