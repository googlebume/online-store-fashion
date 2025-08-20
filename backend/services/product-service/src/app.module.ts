import { Module } from '@nestjs/common';
import { CardsRenderController } from './cards-render/cards-render.controller';
import { CardsRenderService } from './cards-render/cards-render.service';
import { CardsRenderModule } from './cards-render/cards-render.module';
import { ProductCardsLinksModule } from './product-cards-links/product-cards-links.module';

@Module({
  imports: [
    CardsRenderModule, 
    ProductCardsLinksModule, ],
  controllers: [CardsRenderController, ],
  providers: [CardsRenderService, ],
})
export class AppModule { }
