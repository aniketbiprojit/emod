import { Expose, Type } from 'class-transformer';
import { Form } from '../entities/form.entitiy';

export class CreatedFormDTO {
  @Expose()
  @Type(() => Form)
  forms: Form[];
}
