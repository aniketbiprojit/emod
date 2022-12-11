import { AbstractSchema } from '@db/database/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../user/entities/user.entity';
import { FormState } from './form-state.entity';

export type FormDocument = HydratedDocument<Form>;

enum FormTypeEnum {
  MOD = 'MOD',
}

@Schema({
  collection: 'Form',
  timestamps: true,
})
export class Form extends AbstractSchema {
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'FormState',
    default: [],
  })
  formState: FormState[];

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: String, enum: FormTypeEnum })
  type: FormTypeEnum;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true, default: 'local' })
  storageType?: string;

  @Prop({ default: false })
  rejected?: boolean;

  @Prop({ default: '' })
  rejectedReason?: string;
}

export const FormSchema = SchemaFactory.createForClass(Form);
