import { Controller } from '@nestjs/common';
import { DatabaseOrdersService } from './database-orders.service';
import { MessagePattern } from '@nestjs/microservices';
import { OrderDTO } from '@packages/shared/dist/src/dto/order.dto';

@Controller('database-orders')
export class DatabaseOrdersController {
  constructor(private readonly databaseOrdersService: DatabaseOrdersService) { }

  @MessagePattern("get_order_by_id")
  async getOrderById(id: string) {
    return await this.databaseOrdersService.findById(id)
  }

  @MessagePattern("add_order")
  async add(order: OrderDTO) {
    return await this.databaseOrdersService.add(order)
  }
}
