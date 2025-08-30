import { Module } from '@nestjs/common';
import { DatabaseProductsService } from './database-products.service';
import { DatabaseProductsController } from './database-products.controller';

import { PrismaService } from '../prisma.service';
import { ProductRepository } from '../repositories/product.repository';

@Module({
  controllers: [DatabaseProductsController],
  providers: [DatabaseProductsService, ProductRepository, PrismaService],
})
export class DatabaseProductsModule {}
