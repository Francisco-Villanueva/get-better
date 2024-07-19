import { InjectModel } from '@nestjs/mongoose';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { IMessage } from 'src/message/interfaces/message.interface';
import { Message, MessageDocument } from 'src/message/schema/message.schema';

@WebSocketGateway({
  cors: {
    origin: '*', // Aquí especificas la URL de tu frontend
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;
  private users: Map<string, string> = new Map();
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  afterInit(server: Server) {
    console.log('Init Websocket!');
  }
  handleConnection(client: Socket) {
    console.log('Client connected: ', client.id);
  }
  handleDisconnect(client: any) {
    console.log('Client disconnected: ', client.id);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, codeRoom: string) {
    client.join(codeRoom);
    console.log(`Client ${client.id} joined room: ${codeRoom}`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    { message, codeRoom }: { codeRoom: string; message: IMessage },
  ) {
    if (message.message.length > 0) {
      const createdMessage = new this.messageModel(message);
      await createdMessage.save();
      this.server.to(codeRoom).emit('serverMessage', message);
    }
  }

  @SubscribeMessage('setUsername')
  handleSetUsername(client: Socket, username: string): void {
    this.users.set(client.id, username);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { codeRoom: string; message: string; owner: string },
  ) {
    const { message, codeRoom, owner } = data;
    client.to(codeRoom).emit('typing', { owner, message });
  }
}
