import { Expose, ExposeOptions, Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ObjectId } from 'mongoose';
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

export class GetUserDTO extends CreateUserDTO {
  @Transform(({ value, obj, type }) => {
    if (obj._id && typeof obj._id.toString === 'function') {
      return obj._id.toString();
    } else {
      return value;
    }
  })
  @Expose()
  _id: string;
}
