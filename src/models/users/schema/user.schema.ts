import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum userRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Schema({
  timestamps: true,
})
export class Users extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: [userRole.ADMIN, userRole.USER] })
  role: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: null })
  otp: boolean;

  @Prop({ default: null })
  otpExpiryTime: Date;
}

export const UserSchema = SchemaFactory.createForClass(Users);
