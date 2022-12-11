import { IsInt, IsOptional } from 'class-validator';

export class PaginationQueryDTO {
  @IsInt()
  @IsOptional()
  page?: number;

  @IsInt()
  @IsOptional()
  pageSize?: number;
}
