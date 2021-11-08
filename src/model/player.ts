import { Socket } from 'socket.io';
import { randomBytes } from "crypto";
import { Exclude } from 'class-transformer';

export class Player {

  @Exclude()
  socket!: Socket;

  score: number = 0;

  get ip() { return this.socket.handshake.address }

  get socketId() { return this.socket.id }

  id: string;

  type: PlayerType;

  constructor(socket: Socket, type: PlayerType = PlayerType.top) {
    this.socket = socket;

    this.type = type;

    this.id = randomBytes(16).toString('hex');

  }

}

export enum PlayerType {
  top, bottom
}