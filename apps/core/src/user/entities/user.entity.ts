import { AbstractSchema } from '@db/database/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { RoleEnum } from './user-role.enum';
import { Exclude } from 'class-transformer';

export type UserDocument = HydratedDocument<User>;

@Schema({
  collection: 'User',
  timestamps: true,
})
export class User extends AbstractSchema {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    enum: RoleEnum,
  })
  role: RoleEnum;

  @Prop()
  @Exclude()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
