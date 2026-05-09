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
import { ValidatePromoCodeHandler } from '../../application/order/handlers/validate-promo-code.handler';
import { CreatePromoCodeHandler } from '../../application/order/handlers/create-promo-code.handler';
import { ListPromoCodesHandler } from '../../application/order/handlers/list-promo-codes.handler';
import { GetPromoCodeByIdHandler } from '../../application/order/handlers/get-promo-code-by-id.handler';
import { UpdatePromoCodeHandler } from '../../application/order/handlers/update-promo-code.handler';
import { PrismaOrderRepository } from '../../infrastructure/order/repositories/prisma-order.repository';
import { PrismaPromoCodeRepository } from '../../infrastructure/promo-code/repositories/prisma-promo-code.repository';
import { PrismaProductRepository } from '../../infrastructure/product/repositories/prisma-product.repository';
import { PrismaService } from '../../infrastructure/shared/prisma/prisma.service';
import { ORDER_REPOSITORY_PORT } from '../../domain/order/ports/order-repository.port';
import { PRODUCT_REPOSITORY_PORT } from '../../domain/product/ports/product-repository.port';
import { PROMO_CODE_REPOSITORY_PORT } from '../../domain/promo-code/ports/promo-code-repository.port';
import { OrderPricingService } from '../../application/order/services/order-pricing.service';

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
    ValidatePromoCodeHandler,
    CreatePromoCodeHandler,
    ListPromoCodesHandler,
    GetPromoCodeByIdHandler,
    UpdatePromoCodeHandler,
    OrderPricingService,
    {
      provide: ORDER_REPOSITORY_PORT,
      useClass: PrismaOrderRepository,
    },
    {
      provide: PRODUCT_REPOSITORY_PORT,
      useClass: PrismaProductRepository,
    },
    {
      provide: PROMO_CODE_REPOSITORY_PORT,
      useClass: PrismaPromoCodeRepository,
    },
  ],
  exports: [ORDER_REPOSITORY_PORT],
})
export class OrderModule {}
