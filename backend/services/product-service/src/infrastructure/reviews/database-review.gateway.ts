import { Injectable, Inject } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { IDatabaseClient } from '../../interfaces/database-client.interface';
import {
  IProductReviewGateway,
  ReviewDto,
  ReviewStatsDto,
  ReviewsListMeta,
  UserReviewDto,
} from '../../domain/reviews/product-review.gateway.port';

const PATTERNS = {
  LIST: 'get_product_reviews',
  LIST_BY_USER: 'get_user_reviews',
  CREATE: 'create_product_review',
  STATS: 'get_product_review_stats',
  DELETE: 'delete_review',
} as const;

@Injectable()
export class DatabaseReviewGateway implements IProductReviewGateway {
  constructor(
    @Inject('IDatabaseClient')
    private readonly databaseClient: IDatabaseClient,
  ) {}

  async listReviews(
    productId: string,
    page: number,
    limit: number,
  ): Promise<{
    success: boolean;
    data?: ReviewDto[];
    meta?: ReviewsListMeta;
    message?: string;
  }> {
    return lastValueFrom(
      this.databaseClient.send(PATTERNS.LIST, { productId, page, limit }),
    );
  }

  async listReviewsByUser(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{
    success: boolean;
    data?: UserReviewDto[];
    meta?: ReviewsListMeta;
    message?: string;
  }> {
    return lastValueFrom(
      this.databaseClient.send(PATTERNS.LIST_BY_USER, { userId, page, limit }),
    );
  }

  async createReview(payload: {
    userId: string;
    productId: string;
    reviewTitle: string;
    text: string;
    stars: number;
  }): Promise<{ success: boolean; data?: ReviewDto; message?: string }> {
    return lastValueFrom(this.databaseClient.send(PATTERNS.CREATE, payload));
  }

  async getStats(productId: string): Promise<{
    success: boolean;
    data?: ReviewStatsDto;
    message?: string;
  }> {
    return lastValueFrom(this.databaseClient.send(PATTERNS.STATS, { productId }));
  }

  async deleteReview(reviewId: string): Promise<{ success: boolean; message?: string }> {
    return lastValueFrom(this.databaseClient.send(PATTERNS.DELETE, { reviewId }));
  }
}
