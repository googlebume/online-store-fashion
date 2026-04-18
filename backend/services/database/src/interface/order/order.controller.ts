import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Serializers } from '../shared/serializers';
import { CreateOrderHandler } from '../../application/order/handlers/create-order.handler';
import { UpdateOrderHandler } from '../../application/order/handlers/update-order.handler';
import { DeleteOrderHandler } from '../../application/order/handlers/delete-order.handler';
import { UpdateOrderStatusHandler } from '../../application/order/handlers/update-order-status.handler';
import { GetOrderByIdHandler } from '../../application/order/handlers/get-order-by-id.handler';
import { GetUserOrdersHandler } from '../../application/order/handlers/get-user-orders.handler';
import { GetAllOrdersHandler } from '../../application/order/handlers/get-all-orders.handler';
import { GetOrdersByStatusHandler } from '../../application/order/handlers/get-orders-by-status.handler';
import { GetOrderStatisticsHandler } from '../../application/order/handlers/get-order-statistics.handler';
import { CreateOrderCommand } from '../../application/order/commands/create-order.command';
import { UpdateOrderCommand } from '../../application/order/commands/update-order.command';
import { DeleteOrderCommand } from '../../application/order/commands/delete-order.command';
import { UpdateOrderStatusCommand } from '../../application/order/commands/update-order-status.command';
import { GetOrderByIdQuery } from '../../application/order/queries/get-order-by-id.query';
import { GetUserOrdersQuery } from '../../application/order/queries/get-user-orders.query';
import { GetAllOrdersQuery } from '../../application/order/queries/get-all-orders.query';
import { GetOrdersByStatusQuery } from '../../application/order/queries/get-orders-by-status.query';
import { GetOrderStatisticsQuery } from '../../application/order/queries/get-order-statistics.query';

@Controller()
export class OrderController {
  constructor(
    private readonly createOrderHandler: CreateOrderHandler,
    private readonly updateOrderHandler: UpdateOrderHandler,
    private readonly deleteOrderHandler: DeleteOrderHandler,
    private readonly updateOrderStatusHandler: UpdateOrderStatusHandler,
    private readonly getOrderByIdHandler: GetOrderByIdHandler,
    private readonly getUserOrdersHandler: GetUserOrdersHandler,
    private readonly getAllOrdersHandler: GetAllOrdersHandler,
    private readonly getOrdersByStatusHandler: GetOrdersByStatusHandler,
    private readonly getOrderStatisticsHandler: GetOrderStatisticsHandler,
  ) {}

  @MessagePattern('add_order')
  async addOrder(@Payload() data: any) {
    const result = await this.createOrderHandler.execute(
      new CreateOrderCommand(
        data.userId,
        data.items || [],
        data.deliveryMethod,
        data.address,
        data.email,
        data.total,
      ),
    );
    if (!result.ok) return { success: false, message: result.error.message };
    return { success: true, message: 'Order created successfully', data: Serializers.orderToObject(result.value) };
  }

  @MessagePattern('get_order_by_id')
  async getOrderById(@Payload() data: { id: string }) {
    const result = await this.getOrderByIdHandler.execute(new GetOrderByIdQuery(data.id));
    if (!result.ok) return { success: false, message: result.error.message };
    return { success: true, data: Serializers.orderToObject(result.value) };
  }

  @MessagePattern('get_user_orders')
  async getUserOrders(@Payload() data: { userId: string }) {
    const result = await this.getUserOrdersHandler.execute(new GetUserOrdersQuery(data.userId));
    if (!result.ok) return { success: false, message: result.error.message };
    return { success: true, data: result.value.map(o => Serializers.orderToObject(o)) };
  }

  @MessagePattern('get_all_orders')
  async getAllOrders() {
    const result = await this.getAllOrdersHandler.execute(new GetAllOrdersQuery());
    if (!result.ok) return { success: false, message: result.error.message };
    return { success: true, data: result.value.map(o => Serializers.orderToObject(o)) };
  }

  @MessagePattern('update_order')
  async updateOrder(@Payload() data: { id: string; status?: string; address?: string; email?: string; total?: number }) {
    const result = await this.updateOrderHandler.execute(
      new UpdateOrderCommand(data.id, data.status, data.address, data.email, data.total),
    );
    if (!result.ok) return { success: false, message: result.error.message };
    return { success: true, message: 'Order updated successfully', data: Serializers.orderToObject(result.value) };
  }

  @MessagePattern('update_order_status')
  async updateOrderStatus(@Payload() data: { orderId: string; status: string }) {
    const result = await this.updateOrderStatusHandler.execute(
      new UpdateOrderStatusCommand(data.orderId, data.status),
    );
    if (!result.ok) return { success: false, message: result.error.message };
    return { success: true, message: 'Order status updated successfully', data: Serializers.orderToObject(result.value) };
  }

  @MessagePattern('delete_order')
  async deleteOrder(@Payload() data: { id: string }) {
    const result = await this.deleteOrderHandler.execute(new DeleteOrderCommand(data.id));
    if (!result.ok) return { success: false, message: result.error.message };
    return { success: true, message: 'Order deleted successfully' };
  }

  @MessagePattern('get_orders_by_status')
  async getOrdersByStatus(@Payload() data: { status: string }) {
    const result = await this.getOrdersByStatusHandler.execute(new GetOrdersByStatusQuery(data.status));
    if (!result.ok) return { success: false, message: result.error.message };
    return { success: true, data: result.value.map(o => Serializers.orderToObject(o)) };
  }

  @MessagePattern('get_order_statistics')
  async getOrderStatistics(@Payload() data: { filters?: Record<string, any> }) {
    const result = await this.getOrderStatisticsHandler.execute(new GetOrderStatisticsQuery(data.filters));
    if (!result.ok) return { success: false, message: result.error.message };
    return { success: true, data: result.value };
  }
}
