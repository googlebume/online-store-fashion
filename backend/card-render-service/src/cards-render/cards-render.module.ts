import { Module } from '@nestjs/common';
import { CardsRenderService } from './cards-render.service';
import { CardsRenderController } from './cards-render.controller';
// import {ProductRepository} from '@database/repositories/index'

@Module({
  controllers: [CardsRenderController],
  providers: [/*ProductRepository,*/ CardsRenderService],
})
export class CardsRenderModule {}
