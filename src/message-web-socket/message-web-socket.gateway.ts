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
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    //! Emit message only to the client
    client.emit('message-from-server', {
      fullname: 'I am the server',
      message: `Ey! You said ${payload.message || 'no-message!'}`,
    });

    //! Emit message to everyone, but not to the client
    client.broadcast.emit('message-from-server', {
      fullname: 'I am the server',
      message: `Ey! ${client.id} said ${payload.message || 'no-message!'}`,
    });

    //! Emit message to everyone
    this.wss.emit('message-from-server', {
      fullname: 'I am the server',
      message: 'Bored!',
    });
  }
}
