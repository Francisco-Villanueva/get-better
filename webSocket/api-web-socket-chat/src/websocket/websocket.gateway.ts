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
    origin: 'http://localhost:5173', // Aquí especificas la URL de tu frontend
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

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: IMessage,
  ) {
    const createdMessage = new this.messageModel(data);
    await createdMessage.save();
    this.server.emit('ownMessage', data);
    client.broadcast.emit('serverMessage', data);
  }

  @SubscribeMessage('setUsername')
  handleSetUsername(client: Socket, username: string): void {
    this.users.set(client.id, username);
  }

  @SubscribeMessage('typing')
  handleTyping(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    client.broadcast.emit('typing', { owner: client.id, ...data });
  }
}
