import { Injectable, Inject } from '@nestjs/common';
import { createHash } from 'crypto';
import { Result } from '../../../shared/result';
import { GetProductCountQuery } from '../queries/get-product-count.query';
import { PRODUCT_REPOSITORY_PORT, IProductRepository } from '../../../domain/product/ports/product-repository.port';
import { RedisCacheService } from '../../../infrastructure/shared/cache/redis-cache.service';

@Injectable()
export class GetProductCountHandler {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT) private readonly productRepository: IProductRepository,
    private readonly cache: RedisCacheService,
  ) {}

  async execute(query: GetProductCountQuery): Promise<Result<number, Error>> {
    const hash = createHash('md5').update(JSON.stringify(query.filter ?? {})).digest('hex');
    const key = `products:count:${hash}`;
    const cached = await this.cache.get<number>(key);
    if (cached !== null) return { ok: true, value: cached };

    const result = await this.productRepository.count(query.filter);
    if (result.ok) await this.cache.set(key, result.value);
    return result;
  }
}
