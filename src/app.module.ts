import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { ChatGateway } from './chat.gateway';
import { LoggerMiddleware } from './logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { GameService } from './services/game/game.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [ChatGateway, GameService],
})
export class AppModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '/', method: RequestMethod.GET });
  }

}
