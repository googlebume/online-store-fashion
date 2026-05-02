export class CreateReviewCommand {
  constructor(
    readonly userId: string,
    readonly productId: string,
    readonly reviewTitle: string,
    readonly text: string,
    readonly stars: number,
  ) {}
}
