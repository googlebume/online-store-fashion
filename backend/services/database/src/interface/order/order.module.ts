import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { CreateOrderHandler } from '../../application/order/handlers/create-order.handler';
import { UpdateOrderHandler } from '../../application/order/handlers/update-order.handler';
import { DeleteOrderHandler } from '../../application/order/handlers/delete-order.handler';
import { UpdateOrderStatusHandler } from '../../application/order/handlers/update-order-status.handler';
import { GetOrderByIdHandler } from '../../application/order/handlers/get-order-by-id.handler';
import { GetUserOrdersHandler } from '../../application/order/handlers/get-user-orders.handler';
import { GetAllOrdersHandler } from '../../application/order/handlers/get-all-orders.handler';
import { GetOrdersByStatusHandler } from '../../application/order/handlers/get-orders-by-status.handler';
import { GetOrderStatisticsHandler } from '../../application/order/handlers/get-order-statistics.handler';
import { PrismaOrderRepository } from '../../infrastructure/order/repositories/prisma-order.repository';
import { PrismaService } from '../../infrastructure/shared/prisma/prisma.service';
import { ORDER_REPOSITORY_PORT } from '../../domain/order/ports/order-repository.port';

@Module({
  controllers: [OrderController],
  providers: [
    PrismaService,
    CreateOrderHandler,
    UpdateOrderHandler,
    DeleteOrderHandler,
    UpdateOrderStatusHandler,
    GetOrderByIdHandler,
    GetUserOrdersHandler,
    GetAllOrdersHandler,
    GetOrdersByStatusHandler,
    GetOrderStatisticsHandler,
    {
      provide: ORDER_REPOSITORY_PORT,
      useClass: PrismaOrderRepository,
    },
  ],
  exports: [ORDER_REPOSITORY_PORT],
})
export class OrderModule {}
