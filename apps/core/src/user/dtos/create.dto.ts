import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { RoleEnum } from '../entities/user-role.enum';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  @Max(255)
  @Min(2)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Max(255)
  @Min(2)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Max(255)
  @Min(2)
  email: string;

  @IsEnum(RoleEnum)
  @IsNotEmpty()
  @Max(255)
  role: string;

  @IsString()
  @Min(8)
  @Max(255)
  @IsNotEmpty()
  password: string;
}
