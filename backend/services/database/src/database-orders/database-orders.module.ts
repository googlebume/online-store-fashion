import { Module } from '@nestjs/common';
import { DatabaseOrdersService } from './database-orders.service';
import { DatabaseOrdersController } from './database-orders.controller';
import { OrderBaseHandler } from 'src/repositories/order/order-base.repository';

@Module({
  controllers: [DatabaseOrdersController],
  providers: [DatabaseOrdersService, OrderBaseHandler],
})
export class DatabaseOrdersModule {}
