import { Controller, Get } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { Message } from 'src/message/schema/message.schema';

@Controller('websocket')
export class WebsocketController {
  constructor(private readonly wobsocketService: WebsocketService) {}

  @Get('messages')
  async getMessages(): Promise<Message[]> {
    return this.wobsocketService.findAll();
  }
}
