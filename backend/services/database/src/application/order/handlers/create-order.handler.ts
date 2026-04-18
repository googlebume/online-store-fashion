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

@Injectable()
export class CreateOrderHandler {
  constructor(@Inject(ORDER_REPOSITORY_PORT) private readonly orderRepository: IOrderRepository) {}

  async execute(command: CreateOrderCommand): Promise<Result<OrderEntity, Error>> {
    const statusResult = OrderStatus.create(command.status || 'Pending');
    if (!statusResult.ok) return fail(statusResult.error);

    const deliveryResult = DeliveryMethod.create(command.deliveryMethod);
    if (!deliveryResult.ok) return fail(deliveryResult.error);

    const totalResult = Money.create(command.total);
    if (!totalResult.ok) return fail(totalResult.error);

    const items: OrderItemEntity[] = command.items.map(item => {
      const priceResult = Money.create(item.price);
      if (!priceResult.ok) throw priceResult.error;
      return OrderItemEntity.create(
        randomUUID(),
        '',
        item.productId,
        item.quantity,
        priceResult.value,
      );
    });

    const order = OrderEntity.create(
      randomUUID(),
      command.userId,
      statusResult.value,
      deliveryResult.value,
      command.address,
      command.email,
      totalResult.value,
      items,
    );

    return this.orderRepository.save(order);
  }
}
