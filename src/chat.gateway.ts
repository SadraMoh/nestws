import { MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { GameService } from "./services/game/game.service";
import { Player } from "./model/player";

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayInit {

  constructor(public game: GameService) {

  }

  @WebSocketServer()
  server: Server;


  afterInit() {

    this.server.on('connection', (e) => this.connection(e))
    this.server.on('disconnect', (e) => this.disconnection(e))

  }

  connection(socket: Socket) {

    const newPlayer = new Player(socket);

    if (!this.game.players?.find(i => i.ip == newPlayer.ip)) {
      this.game.players.push(newPlayer);
      this.server.emit('player-connected', newPlayer.ip);
    }
  }

  disconnection(socket: Socket) {

    const disconnectedPlayer =
      this.game.players?.find(i => i.ip == socket.handshake.address);

    if (disconnectedPlayer) {
      this.server.emit('player-disconnected', disconnectedPlayer.ip)
    }

  }

  @SubscribeMessage('move')
  async move(socket: Socket) {

    const sender = this.game.getPlayerBySocketId(socket.id);
    this.server.emit('move', sender.ip + ' ' + socket.data)
  }

  //- 

  @SubscribeMessage('message')
  messageSent(@MessageBody() message: string) {

    console.log('received message:', message)

    this.server.emit('message', message);
  }



}