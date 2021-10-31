import { Injectable } from '@nestjs/common';
import { Player } from 'src/model/player';

@Injectable()
export class GameService {

  public players: Player[] = [];

  public getAllPlayers(): Player[] {
    return this.players;
  }

  public getAllPlayerData(): any[] {
    return this.players.map(i => ({ id: i.id, ip: i.ip, socketID: i.socketId }));
  }

  public getPlayerBySocketId(socketId: string): Player {
    return this.players.find(i => i.socketId === socketId);
  }

}
