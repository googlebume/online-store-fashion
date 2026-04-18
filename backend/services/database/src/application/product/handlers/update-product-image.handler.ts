import { Injectable, Inject } from '@nestjs/common';
import { Result, fail } from '../../../shared/result';
import { UpdateProductImageCommand } from '../commands/update-product-image.command';
import { PRODUCT_REPOSITORY_PORT, IProductRepository } from '../../../domain/product/ports/product-repository.port';
import { IMAGE_STORAGE_PORT, IImageStorage } from '../../ports/image-storage.port';
import * as path from 'path';

@Injectable()
export class UpdateProductImageHandler {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT) private readonly productRepository: IProductRepository,
    @Inject(IMAGE_STORAGE_PORT) private readonly imageStorage: IImageStorage,
  ) {}

  async execute(command: UpdateProductImageCommand): Promise<Result<string, Error>> {
    console.log('[UpdateProductImageHandler] Executing with productId:', command.productId);
    console.log('[UpdateProductImageHandler] Buffer length (base64):', command.buffer.length);

    const productResult = await this.productRepository.findById(command.productId);
    if (!productResult.ok) return fail(productResult.error);

    const imagesDir = path.resolve(process.cwd(), 'products');
    const oldImagePath = productResult.value.image ? path.join(imagesDir, path.basename(productResult.value.image)) : null;
    console.log('[UpdateProductImageHandler] Old image path:', oldImagePath);

    const reconstructedFile = {
      buffer: Buffer.from(command.buffer, 'base64'),
      mimetype: command.mimetype,
      originalname: command.originalname,
    };

    console.log('[UpdateProductImageHandler] Reconstructed buffer size:', reconstructedFile.buffer.length);

    const saveResult = await this.imageStorage.updateImage(reconstructedFile, oldImagePath || '', imagesDir);
    console.log('[UpdateProductImageHandler] Update result:', saveResult);

    if (!saveResult.success) {
      return fail(new Error(saveResult.error || 'Failed to update image'));
    }

    if (!saveResult.url) {
      return fail(new Error('Image URL not provided'));
    }

    const updateResult = await this.productRepository.update(command.productId, { image: saveResult.url });
    if (!updateResult.ok) return fail(updateResult.error);

    return { ok: true, value: saveResult.url };
  }
}
