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
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessageWebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  wss: Server;

  constructor(
    private readonly messageWebSocketService: MessageWebSocketService,
    private readonly jwtService: JwtService,
  ) {}

  handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
    } catch (error) {
      client.disconnect();
      return;
    }

    console.log({ payload });

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
