import { Module } from '@nestjs/common';
import { DatabaseOrdersService } from './database-orders.service';
import { DatabaseOrdersController } from './database-orders.controller';
import { OrderBaseHandler } from 'src/repositories/order/order-base.repository';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [DatabaseOrdersController],
  providers: [DatabaseOrdersService, OrderBaseHandler, PrismaService],
})
export class DatabaseOrdersModule {}
