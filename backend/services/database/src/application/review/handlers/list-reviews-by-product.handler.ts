import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result';
import { ListReviewsByProductQuery } from '../queries/list-reviews-by-product.query';
import {
  REVIEW_REPOSITORY_PORT,
  IReviewRepository,
  ReviewListResult,
} from '../../../domain/review/ports/review-repository.port';
import {
  PRODUCT_REPOSITORY_PORT,
  IProductRepository,
} from '../../../domain/product/ports/product-repository.port';

@Injectable()
export class ListReviewsByProductHandler {
  constructor(
    @Inject(REVIEW_REPOSITORY_PORT)
    private readonly reviews: IReviewRepository,
    @Inject(PRODUCT_REPOSITORY_PORT)
    private readonly products: IProductRepository,
  ) {}

  async execute(
    query: ListReviewsByProductQuery,
  ): Promise<Result<ReviewListResult, Error>> {
    const productResult = await this.products.findById(query.productId);
    if (!productResult.ok) {
      return productResult;
    }

    const page = Math.max(1, query.page);
    const limit = Math.min(50, Math.max(1, query.limit));
    const skip = (page - 1) * limit;

    return this.reviews.findByProductId(query.productId, skip, limit);
  }
}
