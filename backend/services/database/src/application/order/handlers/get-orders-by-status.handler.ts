import { Injectable, Inject } from '@nestjs/common';
import { Result, fail } from '../../../shared/result';
import { GetOrdersByStatusQuery } from '../queries/get-orders-by-status.query';
import { OrderEntity } from '../../../domain/order/entities/order.entity';
import { OrderStatus } from '../../../domain/order/value-objects/order-status.vo';
import { ORDER_REPOSITORY_PORT, IOrderRepository } from '../../../domain/order/ports/order-repository.port';

@Injectable()
export class GetOrdersByStatusHandler {
  constructor(@Inject(ORDER_REPOSITORY_PORT) private readonly orderRepository: IOrderRepository) {}

  async execute(query: GetOrdersByStatusQuery): Promise<Result<OrderEntity[], Error>> {
    const statusResult = OrderStatus.create(query.status);
    if (!statusResult.ok) return fail(statusResult.error);
    return this.orderRepository.findByStatus(statusResult.value);
  }
}
