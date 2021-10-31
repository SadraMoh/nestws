import { Controller, Get, Render } from '@nestjs/common';
import { GameService } from './services/game/game.service';

@Controller()
export class AppController {
  constructor(private readonly game: GameService) { }

  @Get()
  @Render('index')
  root() {
    return { socketIP: process.env.WEBSOCKET_IP };
  }

  @Get('chat')
  @Render('chat')
  chat() {
    return { socketIP: process.env.WEBSOCKET_IP };
  }

  @Get('getAllPlayers')
  getAllPlayers() {
    return this.game.getAllPlayerData();
  }

}
