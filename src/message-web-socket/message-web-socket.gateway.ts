import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessageWebSocketService } from './message-web-socket.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dt';

@WebSocketGateway({ cors: true })
export class MessageWebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  wss: Server;

  constructor(
    private readonly messageWebSocketService: MessageWebSocketService,
  ) {}

  handleConnection(client: Socket, ...args: any[]) {
    this.messageWebSocketService.registerClient(client);

    this.wss.emit(
      'clients-updated',
      this.messageWebSocketService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    this.messageWebSocketService.removeClient(client.id);

    console.log(
      `Connected Clients: ${this.messageWebSocketService.getConnectedClients()}`,
    );
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    console.log(client.id, payload);
  }
}
