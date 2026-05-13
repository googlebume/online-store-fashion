import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result';
import { GetPaginatedProductsQuery } from '../queries/get-paginated-products.query';
import { PRODUCT_REPOSITORY_PORT, IProductRepository, PaginatedResult } from '../../../domain/product/ports/product-repository.port';
import { ProductEntity } from '../../../domain/product/entities/product.entity';
import { RedisCacheService } from '../../../infrastructure/shared/cache/redis-cache.service';

@Injectable()
export class GetPaginatedProductsHandler {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT) private readonly productRepository: IProductRepository,
    private readonly cache: RedisCacheService,
  ) {}

  async execute(query: GetPaginatedProductsQuery): Promise<Result<PaginatedResult<ProductEntity>, Error>> {
    const key = `products:paginated:p${query.page ?? 1}:t${query.limit}:c${query.cursor ?? ''}`;
    const cached = await this.cache.get<PaginatedResult<ProductEntity>>(key);
    if (cached) return { ok: true, value: cached };

    const result = await this.productRepository.findPaginated({
      pagination: { limit: query.limit, page: query.page || 1, cursor: query.cursor },
      orderBy: { id: 'desc' },
    });

    if (result.ok) await this.cache.set(key, result.value);
    return result;
  }
}
