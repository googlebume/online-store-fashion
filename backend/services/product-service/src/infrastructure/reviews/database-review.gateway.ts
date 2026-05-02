import { Injectable, Inject } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { IDatabaseClient } from '../../interfaces/database-client.interface';
import {
  IProductReviewGateway,
  ReviewDto,
  ReviewStatsDto,
  ReviewsListMeta,
} from '../../domain/reviews/product-review.gateway.port';

const PATTERNS = {
  LIST: 'get_product_reviews',
  CREATE: 'create_product_review',
  STATS: 'get_product_review_stats',
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
}
