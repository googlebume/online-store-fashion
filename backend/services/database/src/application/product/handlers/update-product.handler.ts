import { Injectable, Inject } from '@nestjs/common';
import { Result, fail } from '../../../shared/result';
import { UpdateProductCommand } from '../commands/update-product.command';
import { ProductEntity } from '../../../domain/product/entities/product.entity';
import { PRODUCT_REPOSITORY_PORT, IProductRepository } from '../../../domain/product/ports/product-repository.port';

@Injectable()
export class UpdateProductHandler {
  constructor(@Inject(PRODUCT_REPOSITORY_PORT) private readonly productRepository: IProductRepository) {}

  async execute(command: UpdateProductCommand): Promise<Result<ProductEntity, Error>> {
    const partial: any = {};
    if (command.name) partial.name = command.name;
    if (command.description) partial.description = command.description;
    if (command.price !== undefined) partial.price = command.price;
    if (command.brand) partial.brand = command.brand;
    if (command.discount !== undefined) partial.discount = command.discount;
    if (command.image) partial.image = command.image;
    if (command.attributes) partial.attributes = command.attributes;

    return this.productRepository.update(command.id, partial);
  }
}
