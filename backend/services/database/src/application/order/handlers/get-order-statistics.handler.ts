import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result';
import { GetOrderStatisticsQuery } from '../queries/get-order-statistics.query';
import { ORDER_REPOSITORY_PORT, IOrderRepository, OrderStatistics } from '../../../domain/order/ports/order-repository.port';

@Injectable()
export class GetOrderStatisticsHandler {
  constructor(@Inject(ORDER_REPOSITORY_PORT) private readonly orderRepository: IOrderRepository) {}

  async execute(query: GetOrderStatisticsQuery): Promise<Result<OrderStatistics, Error>> {
    return this.orderRepository.getStatistics(query.filters);
  }
}
