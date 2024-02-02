import { Module } from '@nestjs/common';
import { MessageWebSocketService } from './message-web-socket.service';
import { MessageWebSocketGateway } from './message-web-socket.gateway';

@Module({
  providers: [MessageWebSocketGateway, MessageWebSocketService],
})
export class MessageWebSocketModule {}
