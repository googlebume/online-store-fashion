import { Reviews as ReviewRow } from '@prisma/client';
import { ReviewEntity } from '../../../domain/review/entities/review.entity';
import { StarRating } from '../../../domain/review/value-objects/star-rating.vo';
import { Result, ok, fail } from '../../../shared/result';

export class ReviewMapper {
  static toDomain(row: ReviewRow): Result<ReviewEntity, Error> {
    const starsResult = StarRating.create(row.stars);
    if (!starsResult.ok) {
      return starsResult;
    }
    return ok(
      new ReviewEntity(row.id, {
        userId: row.userId,
        productId: row.productId,
        userName: row.userName,
        reviewTitle: row.reviewTitle,
        text: row.rewiew,
        stars: starsResult.value,
        createdAt: row.createdAt,
      }),
    );
  }
}
