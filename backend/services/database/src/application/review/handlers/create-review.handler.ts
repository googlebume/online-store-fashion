import { Injectable, Inject } from '@nestjs/common';
import { Result, ok, fail } from '../../../shared/result';
import { CreateReviewCommand } from '../commands/create-review.command';
import { ReviewEntity } from '../../../domain/review/entities/review.entity';
import {
  REVIEW_REPOSITORY_PORT,
  IReviewRepository,
} from '../../../domain/review/ports/review-repository.port';
import {
  PRODUCT_REPOSITORY_PORT,
  IProductRepository,
} from '../../../domain/product/ports/product-repository.port';
import { USER_REPOSITORY_PORT, IUserRepository } from '../../../domain/user/ports/user-repository.port';

@Injectable()
export class CreateReviewHandler {
  constructor(
    @Inject(REVIEW_REPOSITORY_PORT)
    private readonly reviews: IReviewRepository,
    @Inject(PRODUCT_REPOSITORY_PORT)
    private readonly products: IProductRepository,
    @Inject(USER_REPOSITORY_PORT)
    private readonly users: IUserRepository,
  ) {}

  async execute(command: CreateReviewCommand): Promise<Result<ReviewEntity, Error>> {
    const userResult = await this.users.findById(command.userId);
    if (!userResult.ok) {
      return userResult;
    }
    const user = userResult.value;

    const productResult = await this.products.findById(command.productId);
    if (!productResult.ok) {
      return productResult;
    }

    const created = ReviewEntity.create({
      userId: user.id,
      productId: command.productId,
      userName: user.name,
      reviewTitle: command.reviewTitle,
      text: command.text,
      stars: command.stars,
    });
    if (!created.ok) {
      return created;
    }

    return this.reviews.save(created.value);
  }
}
