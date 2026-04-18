import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result';
import { GetUserOrdersQuery } from '../queries/get-user-orders.query';
import { OrderEntity } from '../../../domain/order/entities/order.entity';
import { ORDER_REPOSITORY_PORT, IOrderRepository } from '../../../domain/order/ports/order-repository.port';

@Injectable()
export class GetUserOrdersHandler {
  constructor(@Inject(ORDER_REPOSITORY_PORT) private readonly orderRepository: IOrderRepository) {}

  async execute(query: GetUserOrdersQuery): Promise<Result<OrderEntity[], Error>> {
    return this.orderRepository.findByUserId(query.userId);
  }
}
