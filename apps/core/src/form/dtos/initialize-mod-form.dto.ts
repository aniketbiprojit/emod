import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

@Expose()
export class ModDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  budgetCode: string;

  @IsNumber()
  @IsNotEmpty()
  allocationAmount: number;

  @IsNumber()
  @IsNotEmpty()
  amountSpent: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(1024)
  description?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  serviceName: string;

  @IsNumber()
  @IsNotEmpty()
  serviceCost: number;

  @IsString()
  sourceOfFunding: string;

  @IsObject()
  @IsOptional()
  extras?: Record<string, any>;
}

export class InitializeFormDTO {
  @IsObject()
  @ValidateNested()
  @IsNotEmpty()
  @IsNotEmptyObject()
  formData: ModDTO;

  @IsString()
  @IsNotEmpty()
  name: string;
}
