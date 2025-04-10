import { Module } from '@nestjs/common';
import { ProductCardsLinksService } from './product-cards-links.service';
import { ProductCardsLinksController } from './product-cards-links.controller';

@Module({
  controllers: [ProductCardsLinksController],
  providers: [ProductCardsLinksService],
})
export class ProductCardsLinksModule {}
