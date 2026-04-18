import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { orderClient } from '../order.client';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  async getAllOrders() {
    this.logger.log('[getAllOrders] Requesting orders from order-service');
    const payload = await lastValueFrom(orderClient.send('admin_get_all_orders', {}));
    this.logger.debug(`[getAllOrders] Response payload: ${JSON.stringify(payload)}`);
    return payload;
  }

  async getOrderById(id: string) {
    return await lastValueFrom(orderClient.send('admin_get_order_by_id', { id }));
  }

  async createOrder(data: any) {
    return await lastValueFrom(orderClient.send('admin_create_order', data));
  }

  async updateOrder(id: string, data: { status?: string; address?: string; email?: string; total?: number }) {
    return await lastValueFrom(orderClient.send('admin_update_order', { id, data }));
  }

  async updateOrderStatus(orderId: string, status: string) {
    return await lastValueFrom(orderClient.send('admin_update_order_status', { orderId, status }));
  }

  async deleteOrder(id: string) {
    return await lastValueFrom(orderClient.send('admin_delete_order', { id }));
  }
}
