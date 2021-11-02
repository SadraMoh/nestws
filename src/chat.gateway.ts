import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { GameService } from "./services/game/game.service";
import { Player } from "./model/player";

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  io: Server;

  
  constructor(public game: GameService) { }

  afterInit() {

  }
  
  handleDisconnect(client: Socket) {
    const disconnectedPlayer =
      this.game.players?.find(i => i.ip == client.handshake.address);

    if (disconnectedPlayer) {
      this.io.emit('player-disconnected', disconnectedPlayer.ip)
    }

  }
  
  handleConnection(client: Socket, ...args: any[]) {
    const newPlayer = new Player(client);

    if (!this.game.players?.find(i => i.ip == newPlayer.ip)) {
      this.game.players.push(newPlayer);
      this.io.emit('player-connected', newPlayer.ip);
    }
  }

  @SubscribeMessage('move')
  async move(socket: Socket) {

    const sender = this.game.getPlayerBySocketId(socket.id);
    this.io.emit('move', sender.ip + ' ' + socket.data)
  }

  //- 

  @SubscribeMessage('message')
  messageSent(@MessageBody() message: string) {

    console.log('received message:', message)

    this.io.emit('message', message);
  }
}