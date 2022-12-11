import { Expose, Type } from 'class-transformer';
import { Form } from '../entities/form.entitiy';
import { ModDTO } from './initialize-mod-form.dto';

export class GetFormDTO {
  @Expose()
  @Type(() => Form)
  form: Form;

  @Expose()
  formData: ModDTO;
}
