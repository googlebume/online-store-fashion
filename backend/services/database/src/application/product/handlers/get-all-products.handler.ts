import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result';
import { GetAllProductsQuery } from '../queries/get-all-products.query';
import { ProductEntity } from '../../../domain/product/entities/product.entity';
import { PRODUCT_REPOSITORY_PORT, IProductRepository } from '../../../domain/product/ports/product-repository.port';
import { RedisCacheService } from '../../../infrastructure/shared/cache/redis-cache.service';

@Injectable()
export class GetAllProductsHandler {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT) private readonly productRepository: IProductRepository,
    private readonly cache: RedisCacheService,
  ) {}

  async execute(query: GetAllProductsQuery): Promise<Result<ProductEntity[], Error>> {
    const key = query.withAttributes ? 'products:all:attrs' : 'products:all';
    const cached = await this.cache.get<ProductEntity[]>(key);
    if (cached) return { ok: true, value: cached };

    const result = query.withAttributes
      ? await this.productRepository.findAllWithAttributes()
      : await this.productRepository.findAll();

    if (result.ok) await this.cache.set(key, result.value);
    return result;
  }
}
