import { AbstractSchema } from '@db/database/abstract.schema';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FormStateDocument = HydratedDocument<FormState>;

@Schema({
  collection: 'FormState',
  timestamps: true,
})
export class FormState extends AbstractSchema {}

export const FormStateSchema = SchemaFactory.createForClass(FormState);
