import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result';
import { DeleteProductCommand } from '../commands/delete-product.command';
import { PRODUCT_REPOSITORY_PORT, IProductRepository } from '../../../domain/product/ports/product-repository.port';
import { RedisCacheService } from '../../../infrastructure/shared/cache/redis-cache.service';

@Injectable()
export class DeleteProductHandler {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT) private readonly productRepository: IProductRepository,
    private readonly cache: RedisCacheService,
  ) {}

  async execute(command: DeleteProductCommand): Promise<Result<void, Error>> {
    const result = await this.productRepository.delete(command.id);
    if (result.ok) await this.cache.invalidateProducts();
    return result;
  }
}
