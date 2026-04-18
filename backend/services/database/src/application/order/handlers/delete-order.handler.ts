import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result';
import { DeleteOrderCommand } from '../commands/delete-order.command';
import { ORDER_REPOSITORY_PORT, IOrderRepository } from '../../../domain/order/ports/order-repository.port';

@Injectable()
export class DeleteOrderHandler {
  constructor(@Inject(ORDER_REPOSITORY_PORT) private readonly orderRepository: IOrderRepository) {}

  async execute(command: DeleteOrderCommand): Promise<Result<void, Error>> {
    return this.orderRepository.delete(command.id);
  }
}
