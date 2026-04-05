import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { OrderDTO } from '@packages/shared/dist/src/dto/order.dto';
import { lastValueFrom } from 'rxjs';
import { databaseClient } from 'src/database.client';

@Injectable()
export class OrderingService {
  private readonly logger = new Logger(OrderingService.name);

  async add(order: OrderDTO) {
    try {
      this.logger.log(`[add] Start create order. items=${order?.items?.length ?? 0}, total=${order?.total}, email=${order?.email}`);
      this.logger.debug(`[add] Payload: ${JSON.stringify(order)}`);
      return await this.createOrder(order);
    } catch (error) {
      this.logger.error(`[add] Create order failed: ${error?.message || error}`, error?.stack);
      throw new HttpException(
        "РџРѕРјРёР»РєР° РґРѕРґР°РІР°РЅРЅСЏ РїСЂРѕРґСѓРєС‚Сѓ РІ РєРѕС€РёРє",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async getAllOrders() {
    const response = await lastValueFrom(databaseClient.send('get_all_orders', {}));
    return response?.data ?? response;
  }

  async getOrderById(id: string) {
    const response = await lastValueFrom(databaseClient.send('get_order_by_id', { id }));
    return response?.data ?? response;
  }

  async getUserOrders(userId: string) {
    const response = await lastValueFrom(databaseClient.send('get_user_orders', { userId }));
    return response?.data ?? response;
  }

  async createOrder(order: OrderDTO) {
    this.logger.log('[createOrder] Sending add_order message to database service');
    const response = await lastValueFrom(databaseClient.send('add_order', order));
    this.logger.log(`[createOrder] Received response. success=${response?.success}, orderId=${response?.orderId ?? 'n/a'}`);
    this.logger.debug(`[createOrder] Response payload: ${JSON.stringify(response)}`);
    return response;
  }

  async updateOrder(
    id: string,
    data: { status?: string; address?: string; email?: string; total?: number }
  ) {
    return await lastValueFrom(databaseClient.send('update_order', { id, data }));
  }

  async updateOrderStatus(orderId: string, status: string) {
    return await lastValueFrom(databaseClient.send('update_order_status', { orderId, status }));
  }

  async deleteOrder(id: string) {
    return await lastValueFrom(databaseClient.send('delete_order', { id }));
  }
}
