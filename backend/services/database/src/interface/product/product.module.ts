import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { CreateProductHandler } from '../../application/product/handlers/create-product.handler';
import { UpdateProductHandler } from '../../application/product/handlers/update-product.handler';
import { DeleteProductHandler } from '../../application/product/handlers/delete-product.handler';
import { SaveProductImageHandler } from '../../application/product/handlers/save-product-image.handler';
import { UpdateProductImageHandler } from '../../application/product/handlers/update-product-image.handler';
import { GetAllProductsHandler } from '../../application/product/handlers/get-all-products.handler';
import { GetProductByIdHandler } from '../../application/product/handlers/get-product-by-id.handler';
import { GetProductByNameHandler } from '../../application/product/handlers/get-product-by-name.handler';
import { GetPaginatedProductsHandler } from '../../application/product/handlers/get-paginated-products.handler';
import { SearchProductsHandler } from '../../application/product/handlers/search-products.handler';
import { GetProductCountHandler } from '../../application/product/handlers/get-product-count.handler';
import { PrismaProductRepository } from '../../infrastructure/product/repositories/prisma-product.repository';
import { LocalImageStorageAdapter } from '../../infrastructure/shared/adapters/local-image-storage.adapter';
import { PrismaService } from '../../infrastructure/shared/prisma/prisma.service';
import { PRODUCT_REPOSITORY_PORT } from '../../domain/product/ports/product-repository.port';
import { IMAGE_STORAGE_PORT } from '../../application/ports/image-storage.port';
import { ImageFileHandler } from '@packages/shared/utils/libs/files/image-file.handler';
import { FilesHandlerModule } from '@packages/shared/utils/libs/files/files.module';

@Module({
  imports: [FilesHandlerModule],
  controllers: [ProductController],
  providers: [
    PrismaService,
    CreateProductHandler,
    UpdateProductHandler,
    DeleteProductHandler,
    SaveProductImageHandler,
    UpdateProductImageHandler,
    GetAllProductsHandler,
    GetProductByIdHandler,
    GetProductByNameHandler,
    GetPaginatedProductsHandler,
    SearchProductsHandler,
    GetProductCountHandler,
    LocalImageStorageAdapter,
    {
      provide: PRODUCT_REPOSITORY_PORT,
      useClass: PrismaProductRepository,
    },
    {
      provide: IMAGE_STORAGE_PORT,
      useClass: LocalImageStorageAdapter,
    },
  ],
  exports: [PRODUCT_REPOSITORY_PORT],
})
export class ProductModule {}
