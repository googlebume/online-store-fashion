import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Result, ok, fail } from '../../../shared/result';
import { CreateProductCommand } from '../commands/create-product.command';
import { ProductEntity } from '../../../domain/product/entities/product.entity';
import { ProductName } from '../../../domain/product/value-objects/product-name.vo';
import { Price } from '../../../domain/product/value-objects/price.vo';
import { Discount } from '../../../domain/product/value-objects/discount.vo';
import { PRODUCT_REPOSITORY_PORT, IProductRepository } from '../../../domain/product/ports/product-repository.port';
import { RedisCacheService } from '../../../infrastructure/shared/cache/redis-cache.service';

@Injectable()
export class CreateProductHandler {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT) private readonly productRepository: IProductRepository,
    private readonly cache: RedisCacheService,
  ) {}

  async execute(command: CreateProductCommand): Promise<Result<ProductEntity, Error>> {
    const nameResult = ProductName.create(command.name);
    if (!nameResult.ok) return fail(nameResult.error);

    const priceResult = Price.create(command.price);
    if (!priceResult.ok) return fail(priceResult.error);

    const discountResult = Discount.create(command.discount || 0);
    if (!discountResult.ok) return fail(discountResult.error);

    const product = ProductEntity.create(
      randomUUID(),
      nameResult.value,
      command.description,
      priceResult.value,
      discountResult.value,
      command.brand,
      command.image || '',
    );

    const result = await this.productRepository.save(product);
    if (result.ok) await this.cache.invalidateProducts();
    return result;
  }
}
