import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { PrismaService } from '../../infrastructure/shared/prisma/prisma.service';
import { CreateReviewHandler } from '../../application/review/handlers/create-review.handler';
import { ListReviewsByProductHandler } from '../../application/review/handlers/list-reviews-by-product.handler';
import { GetProductReviewStatsHandler } from '../../application/review/handlers/get-product-review-stats.handler';
import { REVIEW_REPOSITORY_PORT } from '../../domain/review/ports/review-repository.port';
import { PrismaReviewRepository } from '../../infrastructure/review/repositories/prisma-review.repository';

@Module({
  imports: [ProductModule, UserModule],
  controllers: [ReviewController],
  providers: [
    PrismaService,
    CreateReviewHandler,
    ListReviewsByProductHandler,
    GetProductReviewStatsHandler,
    {
      provide: REVIEW_REPOSITORY_PORT,
      useClass: PrismaReviewRepository,
    },
  ],
})
export class ReviewModule {}
