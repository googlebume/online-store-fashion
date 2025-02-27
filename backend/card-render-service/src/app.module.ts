import { Module } from '@nestjs/common';
import { CardsController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [CardsController],
  providers: [AppService],
})
export class AppModule {}
