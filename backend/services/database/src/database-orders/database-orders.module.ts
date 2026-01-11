import { Module } from '@nestjs/common';
import { DatabaseOrdersService } from './database-orders.service';
import { DatabaseOrdersController } from './database-orders.controller';
import { OrderBaseHandler } from '../repositories/order/order-base.repository';
import { PrismaService } from '../prisma.service';

/**
 * DatabaseOrdersModule
 * Модуль для управління замовленнями
 * Інжектує OrderBaseHandler через Dependency Injection
 */
@Module({
  controllers: [DatabaseOrdersController],
  providers: [PrismaService, OrderBaseHandler, DatabaseOrdersService],
  exports: [OrderBaseHandler, DatabaseOrdersService]
})
export class DatabaseOrdersModule {}
