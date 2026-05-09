import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Result, fail } from '../../../shared/result';
import { CreateOrderCommand } from '../commands/create-order.command';
import { OrderEntity } from '../../../domain/order/entities/order.entity';
import { OrderItemEntity } from '../../../domain/order/entities/order-item.entity';
import { OrderStatus } from '../../../domain/order/value-objects/order-status.vo';
import { DeliveryMethod } from '../../../domain/order/value-objects/delivery-method.vo';
import { Money } from '../../../domain/order/value-objects/money.vo';
import { ORDER_REPOSITORY_PORT, IOrderRepository } from '../../../domain/order/ports/order-repository.port';
import { OrderPricingService } from '../services/order-pricing.service';

@Injectable()
export class CreateOrderHandler {
  constructor(
    @Inject(ORDER_REPOSITORY_PORT) private readonly orderRepository: IOrderRepository,
    private readonly orderPricingService: OrderPricingService,
  ) {}

  async execute(command: CreateOrderCommand): Promise<Result<OrderEntity, Error>> {
    try {
      const statusResult = OrderStatus.create(command.status || 'Pending');
      if (!statusResult.ok) return fail(statusResult.error);

      const deliveryResult = DeliveryMethod.create(command.deliveryMethod);
      if (!deliveryResult.ok) return fail(deliveryResult.error);

      const pricing = await this.orderPricingService.prepare(command.items, command.promoCode);
      const subtotalResult = Money.create(pricing.subtotal);
      const promoDiscountTotalResult = Money.create(pricing.promoDiscountTotal);
      const totalResult = Money.create(pricing.total);
      if (!subtotalResult.ok) return fail(subtotalResult.error);
      if (!promoDiscountTotalResult.ok) return fail(promoDiscountTotalResult.error);
      if (!totalResult.ok) return fail(totalResult.error);

      const items: OrderItemEntity[] = pricing.items.map(item => {
        const originalPriceResult = Money.create(item.originalPrice);
        const discountAmountResult = Money.create(item.discountAmount);
        const finalPriceResult = Money.create(item.finalPrice);

        if (!originalPriceResult.ok) throw originalPriceResult.error;
        if (!discountAmountResult.ok) throw discountAmountResult.error;
        if (!finalPriceResult.ok) throw finalPriceResult.error;

        return OrderItemEntity.create(
          randomUUID(),
          '',
          item.productId,
          item.quantity,
          originalPriceResult.value,
          discountAmountResult.value,
          finalPriceResult.value,
        );
      });

      const order = OrderEntity.create(
        randomUUID(),
        command.userId,
        statusResult.value,
        deliveryResult.value,
        command.address,
        command.email,
        subtotalResult.value,
        promoDiscountTotalResult.value,
        totalResult.value,
        items,
        pricing.promoCodeId,
        pricing.promoCode,
      );

      return this.orderRepository.save(order);
    } catch (error) {
      return fail(error as Error);
    }
  }
}
