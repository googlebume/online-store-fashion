import { Module } from '@nestjs/common';
import { CardsRenderController } from './cards-render/cards-render.controller';
import { CardsRenderService } from './cards-render/cards-render.service';
import { CardsRenderModule } from './cards-render/cards-render.module';

@Module({
  imports: [CardsRenderModule, ],
  controllers: [CardsRenderController, ],
  providers: [CardsRenderService, ],
})
export class AppModule { }
