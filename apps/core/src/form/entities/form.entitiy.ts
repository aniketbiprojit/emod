import { AbstractSchema } from '@db/database/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose, Type } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../user/entities/user.entity';
import { FormState } from './form-state.entity';

export type FormDocument = HydratedDocument<Form>;

export enum FormTypeEnum {
  MOD = 'MOD',
}

@Schema({
  collection: 'Form',
  timestamps: true,
})
export class Form extends AbstractSchema {
  @Type(() => FormState)
  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: 'FormState' }],
    default: [],
  })
  @Expose()
  formState: FormState[];

  @Prop({ required: true })
  @Expose()
  name: string;

  @Prop({ required: true, type: String, enum: FormTypeEnum })
  @Expose()
  type: FormTypeEnum;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true, default: 'local' })
  storageType?: string;

  @Prop({ default: false })
  @Expose()
  rejected?: boolean;

  @Prop({ default: '' })
  @Expose()
  rejectedReason?: string;
}

export const FormSchema = SchemaFactory.createForClass(Form);
