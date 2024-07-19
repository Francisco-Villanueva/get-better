import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from 'src/message/schema/message.schema';

@Injectable()
export class WebsocketService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async findAll(): Promise<Message[]> {
    return this.messageModel.find().exec();
  }
  async findByRoom(codeRoom: string): Promise<Message[]> {
    return this.messageModel.find({ codeRoom }).exec();
  }
}
