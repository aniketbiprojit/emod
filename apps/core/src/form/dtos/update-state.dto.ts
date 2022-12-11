import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateStateDTO {
  @IsString()
  @IsNotEmpty()
  toUser: string;
}
