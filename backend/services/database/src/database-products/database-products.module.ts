import { Module } from '@nestjs/common';
import { DatabaseProductsService } from './database-products.service';
import { DatabaseProductsController } from './database-products.controller';
import { PrismaService } from '../prisma.service';
import { ProductRepository } from '../repositories/product.repository';
import { ImageFileHandler } from '@packages/shared/dist/utils/libs/files/image-file.handler';
import { HashCryptoHandler } from '@packages/shared/dist/utils/libs/crypto/hash-crypto.handler';
import { MimeHandler } from '@packages/shared/dist/utils/libs/mime/mime.handler';
import { UtilsCryptoHandler } from '@packages/shared/dist/utils/libs/crypto/utils-crypto.handler';

/**
 * DatabaseProductsModule
 * Модуль для управління продуктами
 * Інжектує ProductRepository та ImageFileHandler через Dependency Injection
 */
@Module({
  controllers: [DatabaseProductsController],
  providers: [
    PrismaService,
    ImageFileHandler,
    HashCryptoHandler,
    UtilsCryptoHandler,
    MimeHandler,
    ProductRepository,
    DatabaseProductsService
  ],
  exports: [ProductRepository, DatabaseProductsService]
})
export class DatabaseProductsModule {}