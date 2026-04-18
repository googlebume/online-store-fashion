export class GetPaginatedProductsQuery {
  constructor(
    readonly limit: number,
    readonly page?: number,
    readonly cursor?: string,
  ) {}
}
