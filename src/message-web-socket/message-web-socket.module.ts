import { Module } from '@nestjs/common';
import { MessageWebSocketService } from './message-web-socket.service';
import { MessageWebSocketGateway } from './message-web-socket.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [MessageWebSocketGateway, MessageWebSocketService],
  imports: [AuthModule],
})
export class MessageWebSocketModule {}
