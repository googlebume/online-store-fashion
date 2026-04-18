import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result';
import { GetAllOrdersQuery } from '../queries/get-all-orders.query';
import { OrderEntity } from '../../../domain/order/entities/order.entity';
import { ORDER_REPOSITORY_PORT, IOrderRepository } from '../../../domain/order/ports/order-repository.port';

@Injectable()
export class GetAllOrdersHandler {
  constructor(@Inject(ORDER_REPOSITORY_PORT) private readonly orderRepository: IOrderRepository) {}

  async execute(query: GetAllOrdersQuery): Promise<Result<OrderEntity[], Error>> {
    return this.orderRepository.findAllWithItems();
  }
}
