import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result';
import { GetProductByNameQuery } from '../queries/get-product-by-name.query';
import { ProductEntity } from '../../../domain/product/entities/product.entity';
import { PRODUCT_REPOSITORY_PORT, IProductRepository } from '../../../domain/product/ports/product-repository.port';
import { RedisCacheService } from '../../../infrastructure/shared/cache/redis-cache.service';

@Injectable()
export class GetProductByNameHandler {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT) private readonly productRepository: IProductRepository,
    private readonly cache: RedisCacheService,
  ) {}

  async execute(query: GetProductByNameQuery): Promise<Result<ProductEntity[], Error>> {
    const key = `products:name:${query.name}`;
    const cached = await this.cache.get<ProductEntity[]>(key);
    if (cached) return { ok: true, value: cached };

    const result = await this.productRepository.findByName(query.name);
    if (result.ok) await this.cache.set(key, result.value);
    return result;
  }
}
