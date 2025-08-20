import { Module } from '@nestjs/common';
import { ProductRepository } from './repositories/product.repository';
import { PrismaService } from './prisma.service';
import { DatabaseProductsModule } from './database-products/database-products.module';
import { DatabaseUsersModule } from './database-users/database-users.module';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [DatabaseProductsModule, DatabaseUsersModule],
  controllers: [PrismaService,],
  providers: [PrismaService, ProductRepository, UserRepository],
})
export class DatabaseModule {}
