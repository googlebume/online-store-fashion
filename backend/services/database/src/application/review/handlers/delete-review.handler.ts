import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result';
import { DeleteReviewCommand } from '../commands/delete-review.command';
import { REVIEW_REPOSITORY_PORT, IReviewRepository } from '../../../domain/review/ports/review-repository.port';

@Injectable()
export class DeleteReviewHandler {
  constructor(
    @Inject(REVIEW_REPOSITORY_PORT)
    private readonly reviews: IReviewRepository,
  ) {}

  async execute(command: DeleteReviewCommand): Promise<Result<void, Error>> {
    return this.reviews.deleteById(command.reviewId);
  }
}
