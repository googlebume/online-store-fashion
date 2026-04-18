import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result';
import { GetProductByIdQuery } from '../queries/get-product-by-id.query';
import { ProductEntity } from '../../../domain/product/entities/product.entity';
import { PRODUCT_REPOSITORY_PORT, IProductRepository } from '../../../domain/product/ports/product-repository.port';

@Injectable()
export class GetProductByIdHandler {
  constructor(@Inject(PRODUCT_REPOSITORY_PORT) private readonly productRepository: IProductRepository) {}

  async execute(query: GetProductByIdQuery): Promise<Result<ProductEntity, Error>> {
    if (query.withAttributes) {
      return this.productRepository.findByIdWithAttributes(query.id);
    }
    return this.productRepository.findById(query.id);
  }
}
