import { Injectable, Inject } from '@nestjs/common';
import { Result, fail } from '../../../shared/result';
import { UpdateOrderStatusCommand } from '../commands/update-order-status.command';
import { OrderEntity } from '../../../domain/order/entities/order.entity';
import { OrderStatus } from '../../../domain/order/value-objects/order-status.vo';
import { ORDER_REPOSITORY_PORT, IOrderRepository } from '../../../domain/order/ports/order-repository.port';

@Injectable()
export class UpdateOrderStatusHandler {
  constructor(@Inject(ORDER_REPOSITORY_PORT) private readonly orderRepository: IOrderRepository) {}

  async execute(command: UpdateOrderStatusCommand): Promise<Result<OrderEntity, Error>> {
    const statusResult = OrderStatus.create(command.status);
    if (!statusResult.ok) return fail(statusResult.error);

    return this.orderRepository.update(command.orderId, { status: statusResult.value.toString() });
  }
}
