import { Module } from '@nestjs/common';
import { ProductReviewsController } from './product-reviews.controller';
import { ProductReviewsService } from './product-reviews.service';
import { DatabaseReviewGateway } from '../infrastructure/reviews/database-review.gateway';
import { PRODUCT_REVIEW_GATEWAY } from '../domain/reviews/product-review.gateway.port';
import { DatabaseClientProvider } from '../interfaces/database-client.provider';
import { ProductCardsLinksModule } from '../product-cards-links/product-cards-links.module';

@Module({
  imports: [ProductCardsLinksModule],
  controllers: [ProductReviewsController],
  providers: [
    ProductReviewsService,
    DatabaseClientProvider,
    {
      provide: PRODUCT_REVIEW_GATEWAY,
      useClass: DatabaseReviewGateway,
    },
  ],
})
export class ProductReviewsModule {}
