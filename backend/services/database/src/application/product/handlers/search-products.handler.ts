import { Injectable, Inject } from '@nestjs/common';
import { createHash } from 'crypto';
import { Result } from '../../../shared/result';
import { SearchProductsQuery } from '../queries/search-products.query';
import { ProductEntity } from '../../../domain/product/entities/product.entity';
import { PRODUCT_REPOSITORY_PORT, IProductRepository } from '../../../domain/product/ports/product-repository.port';
import { RedisCacheService } from '../../../infrastructure/shared/cache/redis-cache.service';

@Injectable()
export class SearchProductsHandler {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT) private readonly productRepository: IProductRepository,
    private readonly cache: RedisCacheService,
  ) {}

  async execute(query: SearchProductsQuery): Promise<Result<ProductEntity[], Error>> {
    const hash = createHash('md5').update(JSON.stringify({ f: query.filter, o: query.options })).digest('hex');
    const key = `products:search:${hash}`;
    const cached = await this.cache.get<ProductEntity[]>(key);
    if (cached) return { ok: true, value: cached };

    const result = await this.productRepository.search(query.filter, query.options);
    if (result.ok) await this.cache.set(key, result.value);
    return result;
  }
}
