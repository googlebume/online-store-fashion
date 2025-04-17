import { Module } from '@nestjs/common';
import { ProductCardsLinksService } from './product-cards-links.service';
import { ProductCardsLinksController } from './product-cards-links.controller';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
  ],
  controllers: [ProductCardsLinksController],
  providers: [ProductCardsLinksService],
})
export class ProductCardsLinksModule {}
