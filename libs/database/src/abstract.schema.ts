import { Prop, Schema } from '@nestjs/mongoose';
import { Expose, Transform } from 'class-transformer';
import { Types } from 'mongoose';

@Schema()
export class AbstractSchema {
  @Transform(({ value, obj, type }) => {
    if (obj._id && typeof obj._id.toString === 'function') {
      return obj._id.toString();
    } else {
      return value;
    }
  })
  @Expose()
  _id: Types.ObjectId;

  @Prop()
  @Expose()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type BaseDocument<T extends AbstractSchema> = Omit<
  T,
  '_id' | 'createdAt' | 'updatedAt'
>;
