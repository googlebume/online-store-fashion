import { Result } from '../../../shared/result';
import { ReviewEntity } from '../entities/review.entity';

export const REVIEW_REPOSITORY_PORT = Symbol('IReviewRepository');

export interface ReviewListResult {
  items: ReviewEntity[];
  total: number;
}

export interface ProductReviewStats {
  totalReviews: number;
  averageRating: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface IReviewRepository {
  save(review: ReviewEntity): Promise<Result<ReviewEntity, Error>>;
  findByProductId(productId: string, skip: number, take: number): Promise<Result<ReviewListResult, Error>>;
  getStatsByProductId(productId: string): Promise<Result<ProductReviewStats, Error>>;
}
