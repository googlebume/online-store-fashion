import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result';
import { GetProductByIdQuery } from '../queries/get-product-by-id.query';
import { ProductEntity } from '../../../domain/product/entities/product.entity';
import { PRODUCT_REPOSITORY_PORT, IProductRepository } from '../../../domain/product/ports/product-repository.port';
import { RedisCacheService } from '../../../infrastructure/shared/cache/redis-cache.service';

@Injectable()
export class GetProductByIdHandler {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT) private readonly productRepository: IProductRepository,
    private readonly cache: RedisCacheService,
  ) {}

  async execute(query: GetProductByIdQuery): Promise<Result<ProductEntity, Error>> {
    const key = query.withAttributes ? `products:id:${query.id}:attrs` : `products:id:${query.id}`;
    const cached = await this.cache.get<ProductEntity>(key);
    if (cached) return { ok: true, value: cached };

    const result = query.withAttributes
      ? await this.productRepository.findByIdWithAttributes(query.id)
      : await this.productRepository.findById(query.id);

    if (result.ok) await this.cache.set(key, result.value);
    return result;
  }
}
