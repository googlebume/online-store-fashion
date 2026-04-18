import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result';
import { GetAllProductsQuery } from '../queries/get-all-products.query';
import { ProductEntity } from '../../../domain/product/entities/product.entity';
import { PRODUCT_REPOSITORY_PORT, IProductRepository } from '../../../domain/product/ports/product-repository.port';

@Injectable()
export class GetAllProductsHandler {
  constructor(@Inject(PRODUCT_REPOSITORY_PORT) private readonly productRepository: IProductRepository) {}

  async execute(query: GetAllProductsQuery): Promise<Result<ProductEntity[], Error>> {
    if (query.withAttributes) {
      return this.productRepository.findAllWithAttributes();
    }
    return this.productRepository.findAll();
  }
}
