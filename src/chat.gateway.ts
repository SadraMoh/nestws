import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  messageSent(@MessageBody() message: string): void {

    console.log('received message:', message)

    this.server.emit('message', message);
  }

}