import { randomUUID } from 'crypto';
import { Entity } from '../../../shared/entity.base';
import { Result, ok, fail } from '../../../shared/result';
import { StarRating } from '../value-objects/star-rating.vo';

export interface ReviewProps {
  userId: string;
  productId: string;
  userName: string;
  reviewTitle: string;
  text: string;
  stars: StarRating;
  createdAt: Date;
}

export class ReviewEntity extends Entity<string, ReviewProps> {
  get userId(): string {
    return this.props.userId;
  }

  get productId(): string {
    return this.props.productId;
  }

  get userName(): string {
    return this.props.userName;
  }

  get reviewTitle(): string {
    return this.props.reviewTitle;
  }

  get text(): string {
    return this.props.text;
  }

  get stars(): StarRating {
    return this.props.stars;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  static create(input: {
    userId: string;
    productId: string;
    userName: string;
    reviewTitle: string;
    text: string;
    stars: number;
  }): Result<ReviewEntity, Error> {
    const starsResult = StarRating.create(input.stars);
    if (!starsResult.ok) {
      return starsResult;
    }

    const title = input.reviewTitle.trim() || 'Відгук';
    const text = input.text.trim();
    if (text.length === 0) {
      return fail(new Error('Текст відгуку обов’язковий'));
    }

    return ok(
      new ReviewEntity(randomUUID(), {
        userId: input.userId,
        productId: input.productId,
        userName: input.userName,
        reviewTitle: title,
        text,
        stars: starsResult.value,
        createdAt: new Date(),
      }),
    );
  }
}
