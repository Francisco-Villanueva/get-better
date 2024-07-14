import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { Message, MessageSchema } from 'src/message/schema/message.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { WebsocketService } from './websocket.service';
import { WebsocketController } from './websocket.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  providers: [WebsocketGateway, WebsocketService],
  controllers: [WebsocketController],
})
export class WebscoketModule {}
