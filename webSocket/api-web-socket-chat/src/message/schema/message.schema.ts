import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop()
  owner: string;

  @Prop()
  message: string;

  @Prop()
  time: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
