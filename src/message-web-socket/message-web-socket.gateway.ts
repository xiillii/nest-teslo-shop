import { WebSocketGateway } from '@nestjs/websockets';
import { MessageWebSocketService } from './message-web-socket.service';

@WebSocketGateway({ cors: true })
export class MessageWebSocketGateway {
  constructor(
    private readonly messageWebSocketService: MessageWebSocketService,
  ) {}
}
