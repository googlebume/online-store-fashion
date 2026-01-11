import { Controller } from '@nestjs/common';
import { DatabaseOrdersService } from './database-orders.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

/**
 * Database Orders Controller
 * Microservice controller using MessagePattern for inter-service communication
 * All methods follow the repository pattern through DatabaseOrdersService
 */
@Controller('database-orders')
export class DatabaseOrdersController {
  constructor(private readonly databaseOrdersService: DatabaseOrdersService) {}

  /**
   * Get order by ID - microservice message pattern
   */
  @MessagePattern('get_order_by_id')
  async getOrderById(@Payload() data: { id: string }) {
    return this.databaseOrdersService.findById(data.id);
  }

  /**
   * Create new order - microservice message pattern
   */
  @MessagePattern('add_order')
  async createOrder(@Payload() data: any) {
    return this.databaseOrdersService.createOrder(data);
  }

  /**
   * Get user orders - microservice message pattern
   */
  @MessagePattern('get_user_orders')
  async getUserOrders(@Payload() data: { userId: string }) {
    return this.databaseOrdersService.getUserOrders(data.userId);
  }

  /**
   * Get all orders - microservice message pattern
   */
  @MessagePattern('get_all_orders')
  async getAllOrders() {
    return this.databaseOrdersService.getAllOrders();
  }

  /**
   * Update order status - microservice message pattern
   */
  @MessagePattern('update_order_status')
  async updateOrderStatus(@Payload() data: { orderId: string; status: string }) {
    return this.databaseOrdersService.updateOrderStatus(data.orderId, data.status);
  }

  /**
   * Get orders by status - microservice message pattern
   */
  @MessagePattern('get_orders_by_status')
  async getOrdersByStatus(@Payload() data: { status: string }) {
    return this.databaseOrdersService.getOrdersByStatus(data.status);
  }

  /**
   * Delete order - microservice message pattern
   */
  @MessagePattern('delete_order')
  async deleteOrder(@Payload() data: { id: string }) {
    return this.databaseOrdersService.deleteOrder(data.id);
  }

  /**
   * Get order statistics - microservice message pattern
   */
  @MessagePattern('get_order_statistics')
  async getStatistics(@Payload() data?: { filters?: any }) {
    return this.databaseOrdersService.getStatistics(data?.filters);
  }
}
