export class SearchProductsQuery {
  constructor(
    readonly filter: Record<string, any>,
    readonly options?: { orderBy?: Record<string, 'asc' | 'desc'>; limit?: number; page?: number },
  ) {}
}
