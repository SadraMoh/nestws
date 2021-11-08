import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { GameService } from "./services/game/game.service";
import { Player, PlayerType } from "./model/player";
import { Movement } from "./model/movement";

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  io: Server;


  constructor(public game: GameService) { }

  afterInit() {

  }

  playerTop!: Player;
  playerBottom!: Player;

  handleDisconnect(client: Socket) {
    // const disconnectedPlayer =
    //   this.game.players?.find(i => i.ip == client.handshake.address);

    // if (disconnectedPlayer) {
    //   this.io.emit('player-disconnected', disconnectedPlayer.ip)
    // }

    this.playerBottom = this.playerTop = undefined;
    
  }

  handleConnection(client: Socket, ...args: any[]) {
    // const newPlayer = new Player(client);

    // if (!this.game.players?.find(i => i.ip == newPlayer.ip)) {
    //   this.game.players.push(newPlayer);
    //   this.io.emit('player-connected', newPlayer.ip);
    // }

    if (this.playerTop) {
      this.playerBottom = new Player(client, PlayerType.bottom);
      client.emit('assign', PlayerType.bottom);
    } else {
      this.playerTop = new Player(client, PlayerType.top);
      client.emit('assign', PlayerType.top);
    }
    
  }

  @SubscribeMessage('move')
  async move(@MessageBody() msg: Movement) {

    this.io.emit('move', msg);

    // const sender = this.game.getPlayerBySocketId(socket.id);
    // this.io.emit('move', sender.ip + ' ' + socket.data)
  }

  //- 

  @SubscribeMessage('message')
  messageSent(@MessageBody() message: string) {

    console.log('received message:', message)

    this.io.emit('message', message);
  }
}