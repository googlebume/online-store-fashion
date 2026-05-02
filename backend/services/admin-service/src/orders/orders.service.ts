import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ORDER_SERVICE } from '../microservices/tcp.tokens';
import { sendMicroserviceRpc } from '../microservices/tcp-rpc.util';

const ORDER_DOWN_HINT =
  'order-service недоступний (TCP 5006). Запустіть order-service (microservice + HTTP 4006).';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(@Inject(ORDER_SERVICE) private readonly orderClient: ClientProxy) {}

  private async rpc<TResult>(pattern: string, payload: unknown): Promise<TResult> {
    return sendMicroserviceRpc<TResult>(
      this.orderClient,
      this.logger,
      'order',
      pattern,
      payload,
      ORDER_DOWN_HINT,
    );
  }

  async getAllOrders() {
    this.logger.log('[getAllOrders] Запит до order-service');
    const payload = await this.rpc('admin_get_all_orders', {});
    this.logger.debug(
      `[getAllOrders] відповідь: ${Array.isArray(payload) ? `масив, ${payload.length} записів` : typeof payload}`,
    );
    return payload;
  }

  async getOrderById(id: string) {
    return this.rpc('admin_get_order_by_id', { id });
  }

  async createOrder(data: any) {
    return this.rpc('admin_create_order', data);
  }

  async updateOrder(id: string, data: { status?: string; address?: string; email?: string; total?: number }) {
    return this.rpc('admin_update_order', { id, data });
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.rpc('admin_update_order_status', { orderId, status });
  }

  async deleteOrder(id: string) {
    return this.rpc('admin_delete_order', { id });
  }
}
