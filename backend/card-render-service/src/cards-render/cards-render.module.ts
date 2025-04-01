import { Module } from '@nestjs/common';
import { CardsRenderService } from './cards-render.service';
import { CardsRenderController } from './cards-render.controller';

@Module({
  controllers: [CardsRenderController],
  providers: [CardsRenderService],
})
export class CardsRenderModule {}
