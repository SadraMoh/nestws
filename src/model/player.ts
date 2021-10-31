import { Socket } from 'socket.io';
import { randomBytes } from "crypto";
import { Exclude } from 'class-transformer';

export class Player {

  @Exclude()
  socket!: Socket;
  
  get ip() { return this.socket.handshake.address }
  
  get socketId() { return this.socket.id }
  
  id: string;

  constructor(socket: Socket) {
    this.socket = socket;

    this.id = randomBytes(16).toString('hex');

  }

}