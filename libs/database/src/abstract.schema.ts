import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class AbstractSchema {
  _id: Types.ObjectId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type BaseDocument<T extends AbstractSchema> = Omit<
  T,
  '_id' | 'createdAt' | 'updatedAt'
>;
