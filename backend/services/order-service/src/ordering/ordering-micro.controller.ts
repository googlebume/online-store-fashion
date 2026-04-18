import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderingService } from './ordering.service';
import { OrderDTO } from '@packages/shared/dto/order.dto';

@Controller('ordering-micro')
export class OrderingMicroController {
  constructor(private readonly orderingService: OrderingService) {}

  @MessagePattern('admin_get_all_orders')
  async getAllOrders() {
    return this.orderingService.getAllOrders();
  }

  @MessagePattern('admin_get_order_by_id')
  async getOrderById(@Payload() data: { id: string }) {
    return this.orderingService.getOrderById(data.id);
  }

  @MessagePattern('admin_create_order')
  async createOrder(@Payload() data: OrderDTO) {
    return this.orderingService.createOrder(data);
  }

  @MessagePattern('admin_update_order')
  async updateOrder(
    @Payload() data: { id: string; data: { status?: string; address?: string; email?: string; total?: number } }
  ) {
    return this.orderingService.updateOrder(data.id, data.data);
  }

  @MessagePattern('admin_update_order_status')
  async updateOrderStatus(@Payload() data: { orderId: string; status: string }) {
    return this.orderingService.updateOrderStatus(data.orderId, data.status);
  }

  @MessagePattern('admin_delete_order')
  async deleteOrder(@Payload() data: { id: string }) {
    return this.orderingService.deleteOrder(data.id);
  }
}
