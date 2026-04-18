import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result';
import { GetOrderByIdQuery } from '../queries/get-order-by-id.query';
import { OrderEntity } from '../../../domain/order/entities/order.entity';
import { ORDER_REPOSITORY_PORT, IOrderRepository } from '../../../domain/order/ports/order-repository.port';

@Injectable()
export class GetOrderByIdHandler {
  constructor(@Inject(ORDER_REPOSITORY_PORT) private readonly orderRepository: IOrderRepository) {}

  async execute(query: GetOrderByIdQuery): Promise<Result<OrderEntity, Error>> {
    return this.orderRepository.findByIdWithItems(query.id);
  }
}
