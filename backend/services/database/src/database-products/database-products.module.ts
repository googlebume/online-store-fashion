import { Module } from '@nestjs/common';
import { DatabaseProductsService } from './database-products.service';
import { DatabaseProductsController } from './database-products.controller';

import { PrismaService } from 'src/prisma.service';
import { ProductRepository } from 'src/repositories/product.repository';

@Module({
  controllers: [DatabaseProductsController],
  providers: [DatabaseProductsService, ProductRepository, PrismaService],
})
export class DatabaseProductsModule {}
