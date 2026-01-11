import { Module } from '@nestjs/common';
import { CardsRenderModule } from './cards-render/cards-render.module';
import { ProductCardsLinksModule } from './product-cards-links/product-cards-links.module';

/**
 * App Module
 * SOLID Principle: Single Responsibility
 * Main application module that imports feature modules
 */
@Module({
  imports: [CardsRenderModule, ProductCardsLinksModule],
})
export class AppModule {}
