import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MessageType } from '../interfaces/message.interface';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop()
  owner: string;

  @Prop()
  message: string;

  @Prop()
  time: string;
  @Prop()
  type: MessageType;
  @Prop()
  codeRoom: string; // Añadir este campo
}

export const MessageSchema = SchemaFactory.createForClass(Message);
