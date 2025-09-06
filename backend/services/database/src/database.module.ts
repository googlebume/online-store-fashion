import { Module } from '@nestjs/common';
import { ProductRepository } from './repositories/product.repository';
import { PrismaService } from './prisma.service';
import { DatabaseProductsModule } from './database-products/database-products.module';
import { DatabaseUsersModule } from './database-users/database-users.module';
import { UserRepository } from './repositories/user.repository';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import {FilesHandlerModule} from '@packages/shared/dist/utils/libs/files/files.module'
import {CryptoHandlerModule} from '@packages/shared/dist/utils/libs/crypto/crypto.module'
import {MimeHandlerModule} from '@packages/shared/dist/utils/libs/mime/mime.module'

const productsPath = join(process.cwd(), 'products');

@Module({
  imports: [
    DatabaseProductsModule,
    DatabaseUsersModule,
    FilesHandlerModule,
    CryptoHandlerModule,
    MimeHandlerModule,
    ServeStaticModule.forRoot({
      rootPath: productsPath,
      serveRoot: '/products',
    })

  ],
  controllers: [],
  providers: [PrismaService, ProductRepository, UserRepository],
})
export class DatabaseModule { }
