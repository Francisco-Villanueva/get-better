import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { Message } from 'src/message/schema/message.schema';

@Controller('websocket')
export class WebsocketController {
  constructor(private readonly wobsocketService: WebsocketService) {}

  @Get('messages/:codeRoom')
  async getMessages(@Param() data: { codeRoom: string }): Promise<Message[]> {
    const res = await this.wobsocketService.findByRoom(data.codeRoom);
    return res;
  }
}
