import { Module } from '@nestjs/common';
import { DatabaseController } from './database.controller';
import { DatabaseService } from './database.service';
import { ProductRepository } from './repositories/product.repository';
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  controllers: [PrismaService ,DatabaseController],
  providers: [PrismaService ,DatabaseService, ProductRepository],
})
export class DatabaseModule {}
