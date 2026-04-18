import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result';
import { GetProductByNameQuery } from '../queries/get-product-by-name.query';
import { ProductEntity } from '../../../domain/product/entities/product.entity';
import { PRODUCT_REPOSITORY_PORT, IProductRepository } from '../../../domain/product/ports/product-repository.port';

@Injectable()
export class GetProductByNameHandler {
  constructor(@Inject(PRODUCT_REPOSITORY_PORT) private readonly productRepository: IProductRepository) {}

  async execute(query: GetProductByNameQuery): Promise<Result<ProductEntity[], Error>> {
    return this.productRepository.findByName(query.name);
  }
}
