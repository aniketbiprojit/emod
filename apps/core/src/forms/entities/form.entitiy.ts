import { AbstractSchema } from '@db/database/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../user/entities/user.entity';
import { FormState } from './form-state.entity';

export type FormDocument = HydratedDocument<Form>;

@Schema({
  collection: 'Form',
  timestamps: true,
})
export class Form extends AbstractSchema {
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'FormState',
  })
  formState: FormState[];
}

export const FormSchema = SchemaFactory.createForClass(Form);
