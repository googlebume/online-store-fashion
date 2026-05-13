import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ReviewModule } from './review/review.module';
import { FilesHandlerModule } from '@packages/shared/utils/libs/files/files.module';
import { CryptoHandlerModule } from '@packages/shared/utils/libs/crypto/crypto.module';
import { MimeHandlerModule } from '@packages/shared/utils/libs/mime/mime.module';
import { PrismaService } from '../infrastructure/shared/prisma/prisma.service';
import { RedisCacheModule } from '../infrastructure/shared/cache/redis-cache.module';

const productsPath = process.env.PRODUCTS_DIR ?? join(process.cwd(), 'products');

@Module({
  imports: [
    UserModule,
    ProductModule,
    OrderModule,
    AnalyticsModule,
    ReviewModule,
    RedisCacheModule,
    FilesHandlerModule,
    CryptoHandlerModule,
    MimeHandlerModule,
    ServeStaticModule.forRoot({
      rootPath: productsPath,
      serveRoot: '/products',
    }),
  ],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
