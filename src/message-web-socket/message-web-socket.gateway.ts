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
    this.messageWebSocketService.registerClient(client);

    console.log(
      `Connected Clients: ${this.messageWebSocketService.getConnectedClients()}`,
    );
  }

  handleDisconnect(client: Socket) {
    this.messageWebSocketService.removeClient(client.id);

    console.log(
      `Connected Clients: ${this.messageWebSocketService.getConnectedClients()}`,
    );
  }
}
