import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../shared/result';
import { UpdateOrderCommand } from '../commands/update-order.command';
import { OrderEntity } from '../../../domain/order/entities/order.entity';
import { ORDER_REPOSITORY_PORT, IOrderRepository } from '../../../domain/order/ports/order-repository.port';

@Injectable()
export class UpdateOrderHandler {
  constructor(@Inject(ORDER_REPOSITORY_PORT) private readonly orderRepository: IOrderRepository) {}

  async execute(command: UpdateOrderCommand): Promise<Result<OrderEntity, Error>> {
    const partial: any = {};
    if (command.status) partial.status = command.status;
    if (command.address) partial.address = command.address;
    if (command.email) partial.email = command.email;
    if (command.total !== undefined) partial.total = command.total;

    return this.orderRepository.update(command.id, partial);
  }
}
