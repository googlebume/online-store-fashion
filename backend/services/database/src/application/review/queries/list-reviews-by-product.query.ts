export class ListReviewsByProductQuery {
  constructor(
    readonly productId: string,
    readonly page: number,
    readonly limit: number,
  ) {}
}
