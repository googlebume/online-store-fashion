import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result';
import { GetProductReviewStatsQuery } from '../queries/get-product-review-stats.query';
import {
  REVIEW_REPOSITORY_PORT,
  IReviewRepository,
  ProductReviewStats,
} from '../../../domain/review/ports/review-repository.port';
import {
  PRODUCT_REPOSITORY_PORT,
  IProductRepository,
} from '../../../domain/product/ports/product-repository.port';

@Injectable()
export class GetProductReviewStatsHandler {
  constructor(
    @Inject(REVIEW_REPOSITORY_PORT)
    private readonly reviews: IReviewRepository,
    @Inject(PRODUCT_REPOSITORY_PORT)
    private readonly products: IProductRepository,
  ) {}

  async execute(query: GetProductReviewStatsQuery): Promise<Result<ProductReviewStats, Error>> {
    const productResult = await this.products.findById(query.productId);
    if (!productResult.ok) {
      return productResult;
    }

    return this.reviews.getStatsByProductId(query.productId);
  }
}
