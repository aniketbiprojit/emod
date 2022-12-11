import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RoleEnum } from '../entities/user-role.enum';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(2)
  @Expose()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(2)
  @Expose()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  @MinLength(2)
  @Expose()
  email: string;

  @IsEnum(RoleEnum)
  @IsNotEmpty()
  @MaxLength(255)
  @Expose()
  role: string;

  @IsString()
  @MinLength(8)
  @MaxLength(255)
  @IsNotEmpty()
  password: string;
}
