import { Module } from '@nestjs/common';
import { CardsRenderController } from './cards-render/cards-render.controller';
import { CardsRenderService } from './cards-render/cards-render.service';
import { CardsRenderModule } from './cards-render/cards-render.module';
import { FiltersHandlerModule } from './filters-handler/filters-handler.module';
import { FiltersHandlerController } from './filters-handler/filters-handler.controller';
import { FiltersHandlerService } from './filters-handler/filters-handler.service';

@Module({
  imports: [CardsRenderModule, FiltersHandlerModule],
  controllers: [CardsRenderController, FiltersHandlerController],
  providers: [CardsRenderService, FiltersHandlerService],
})
export class AppModule { }
