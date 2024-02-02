import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { MessageWebSocketService } from './message-web-socket.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MessageWebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly messageWebSocketService: MessageWebSocketService,
  ) {}

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected${client.id} with arguments ${args}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconected ${client.id}`);
  }
}
