import { IsString, MaxLength, MinLength } from 'class-validator';

export class RejectFormDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  rejectedReason: string;
}
