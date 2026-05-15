import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result';
import { ListReviewsByUserQuery } from '../queries/list-reviews-by-user.query';
import {
  REVIEW_REPOSITORY_PORT,
  IReviewRepository,
  UserReviewListResult,
} from '../../../domain/review/ports/review-repository.port';

@Injectable()
export class ListReviewsByUserHandler {
  constructor(
    @Inject(REVIEW_REPOSITORY_PORT)
    private readonly reviews: IReviewRepository,
  ) {}

  async execute(query: ListReviewsByUserQuery): Promise<Result<UserReviewListResult, Error>> {
    const page = Math.max(1, query.page);
    const limit = Math.min(50, Math.max(1, query.limit));
    const skip = (page - 1) * limit;
    return this.reviews.findByUserId(query.userId, skip, limit);
  }
}
