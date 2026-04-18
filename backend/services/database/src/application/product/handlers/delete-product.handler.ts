import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result';
import { DeleteProductCommand } from '../commands/delete-product.command';
import { PRODUCT_REPOSITORY_PORT, IProductRepository } from '../../../domain/product/ports/product-repository.port';

@Injectable()
export class DeleteProductHandler {
  constructor(@Inject(PRODUCT_REPOSITORY_PORT) private readonly productRepository: IProductRepository) {}

  async execute(command: DeleteProductCommand): Promise<Result<void, Error>> {
    return this.productRepository.delete(command.id);
  }
}
