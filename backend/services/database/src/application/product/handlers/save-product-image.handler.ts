import { Injectable, Inject } from '@nestjs/common';
import { Result, fail } from '../../../shared/result';
import { SaveProductImageCommand } from '../commands/save-product-image.command';
import { PRODUCT_REPOSITORY_PORT, IProductRepository } from '../../../domain/product/ports/product-repository.port';
import { IMAGE_STORAGE_PORT, IImageStorage } from '../../ports/image-storage.port';
import * as path from 'path';

@Injectable()
export class SaveProductImageHandler {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT) private readonly productRepository: IProductRepository,
    @Inject(IMAGE_STORAGE_PORT) private readonly imageStorage: IImageStorage,
  ) {}

  async execute(command: SaveProductImageCommand): Promise<Result<string, Error>> {
    const imagesDir = path.resolve(process.cwd(), 'products');
    const saveResult = await this.imageStorage.saveImage(command.file, imagesDir);

    if (!saveResult.success) {
      return fail(new Error(saveResult.error || 'Failed to save image'));
    }

    if (!saveResult.url) {
      return fail(new Error('Image URL not provided'));
    }

    const updateResult = await this.productRepository.update(command.productId, { image: saveResult.url });
    if (!updateResult.ok) return fail(updateResult.error);

    return { ok: true, value: saveResult.url };
  }
}
