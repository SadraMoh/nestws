import { MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayInit {

  @WebSocketServer()
  server: Server;

  afterInit() {
    
  }

  @SubscribeMessage('message')
  messageSent(@MessageBody() message: string): void {

    console.log('received message:', message)

    this.server.emit('message', message);
  }

}