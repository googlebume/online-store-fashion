import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePromoCodeDTO, UpdatePromoCodeDTO } from '@packages/shared/dto/order.dto';
import { ORDER_SERVICE } from '../microservices/tcp.tokens';
import { sendMicroserviceRpc } from '../microservices/tcp-rpc.util';

const ORDER_DOWN_HINT =
  'order-service недоступний (TCP 5006). Запустіть order-service (microservice + HTTP 4006).';

@Injectable()
export class PromoCodesService {
  private readonly logger = new Logger(PromoCodesService.name);

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

  async listPromoCodes() {
    return this.rpc('admin_list_promo_codes', {});
  }

  async getPromoCodeById(id: string) {
    return this.rpc('admin_get_promo_code_by_id', { id });
  }

  async createPromoCode(data: CreatePromoCodeDTO) {
    return this.rpc('admin_create_promo_code', data);
  }

  async updatePromoCode(data: UpdatePromoCodeDTO) {
    return this.rpc('admin_update_promo_code', data);
  }
}
