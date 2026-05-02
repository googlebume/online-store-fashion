import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Serializers } from '../shared/serializers';
import { CreateReviewHandler } from '../../application/review/handlers/create-review.handler';
import { ListReviewsByProductHandler } from '../../application/review/handlers/list-reviews-by-product.handler';
import { GetProductReviewStatsHandler } from '../../application/review/handlers/get-product-review-stats.handler';
import { CreateReviewCommand } from '../../application/review/commands/create-review.command';
import { ListReviewsByProductQuery } from '../../application/review/queries/list-reviews-by-product.query';
import { GetProductReviewStatsQuery } from '../../application/review/queries/get-product-review-stats.query';

@Controller()
export class ReviewController {
  constructor(
    private readonly createReview: CreateReviewHandler,
    private readonly listReviews: ListReviewsByProductHandler,
    private readonly getStats: GetProductReviewStatsHandler,
  ) {}

  @MessagePattern('get_product_reviews')
  async handleGetReviews(
    @Payload()
    data: {
      productId: string;
      page?: number;
      limit?: number;
    },
  ) {
    const page = Math.max(1, data.page ?? 1);
    const limit = Math.min(50, Math.max(1, data.limit ?? 10));

    const result = await this.listReviews.execute(
      new ListReviewsByProductQuery(data.productId, page, limit),
    );
    if (!result.ok) {
      return { success: false, message: result.error.message };
    }

    return {
      success: true,
      data: result.value.items.map(r => Serializers.reviewToObject(r)),
      meta: {
        total: result.value.total,
        page,
        limit,
        hasMore: page * limit < result.value.total,
      },
    };
  }

  @MessagePattern('create_product_review')
  async handleCreateReview(
    @Payload()
    data: {
      userId: string;
      productId: string;
      reviewTitle: string;
      text: string;
      stars: number;
    },
  ) {
    const result = await this.createReview.execute(
      new CreateReviewCommand(
        data.userId,
        data.productId,
        data.reviewTitle,
        data.text,
        data.stars,
      ),
    );
    if (!result.ok) {
      return { success: false, message: result.error.message };
    }
    return { success: true, data: Serializers.reviewToObject(result.value) };
  }

  @MessagePattern('get_product_review_stats')
  async handleGetStats(@Payload() data: { productId: string }) {
    const result = await this.getStats.execute(new GetProductReviewStatsQuery(data.productId));
    if (!result.ok) {
      return { success: false, message: result.error.message };
    }
    return { success: true, data: result.value };
  }
}
