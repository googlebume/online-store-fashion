import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result';
import { SearchProductsQuery } from '../queries/search-products.query';
import { ProductEntity } from '../../../domain/product/entities/product.entity';
import { PRODUCT_REPOSITORY_PORT, IProductRepository } from '../../../domain/product/ports/product-repository.port';

@Injectable()
export class SearchProductsHandler {
  constructor(@Inject(PRODUCT_REPOSITORY_PORT) private readonly productRepository: IProductRepository) {}

  async execute(query: SearchProductsQuery): Promise<Result<ProductEntity[], Error>> {
    return this.productRepository.search(query.filter, query.options);
  }
}
