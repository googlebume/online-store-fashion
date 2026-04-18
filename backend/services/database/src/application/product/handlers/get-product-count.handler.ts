import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result';
import { GetProductCountQuery } from '../queries/get-product-count.query';
import { PRODUCT_REPOSITORY_PORT, IProductRepository } from '../../../domain/product/ports/product-repository.port';

@Injectable()
export class GetProductCountHandler {
  constructor(@Inject(PRODUCT_REPOSITORY_PORT) private readonly productRepository: IProductRepository) {}

  async execute(query: GetProductCountQuery): Promise<Result<number, Error>> {
    return this.productRepository.count(query.filter);
  }
}
