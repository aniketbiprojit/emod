import { AbstractSchema } from '@db/database/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose, Type } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../user/entities/user.entity';

export type FormStateDocument = HydratedDocument<FormState>;

@Schema({
  collection: 'FormState',
  timestamps: true,
})
export class FormState extends AbstractSchema {
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  @Type(() => User)
  @Expose()
  from: User;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'User',
  })
  @Expose()
  to?: string;
}

export const FormStateSchema = SchemaFactory.createForClass(FormState);
