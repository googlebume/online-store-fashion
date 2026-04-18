import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result';
import { GetPaginatedProductsQuery } from '../queries/get-paginated-products.query';
import { PRODUCT_REPOSITORY_PORT, IProductRepository, PaginatedResult } from '../../../domain/product/ports/product-repository.port';
import { ProductEntity } from '../../../domain/product/entities/product.entity';

@Injectable()
export class GetPaginatedProductsHandler {
  constructor(@Inject(PRODUCT_REPOSITORY_PORT) private readonly productRepository: IProductRepository) {}

  async execute(query: GetPaginatedProductsQuery): Promise<Result<PaginatedResult<ProductEntity>, Error>> {
    return this.productRepository.findPaginated({
      pagination: { limit: query.limit, page: query.page || 1, cursor: query.cursor },
      orderBy: { id: 'desc' },
    });
  }
}
