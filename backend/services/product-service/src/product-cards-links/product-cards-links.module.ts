import { Module } from '@nestjs/common';
import { ProductCardsLinksService } from './product-cards-links.service';
import { ProductCardsLinksController } from './product-cards-links.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseClientProvider } from '../interfaces/database-client.provider';

/**
 * Product Cards Links Module
 * SOLID Principle: Dependency Inversion
 * Provides dependencies through interfaces
 */
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
  providers: [ProductCardsLinksService, DatabaseClientProvider],
  exports: [ProductCardsLinksService],
})
export class ProductCardsLinksModule {}
