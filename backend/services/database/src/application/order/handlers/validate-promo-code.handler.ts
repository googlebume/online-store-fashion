import { Injectable } from '@nestjs/common';
import { Result, fail, ok } from '../../../shared/result';
import { ValidatePromoCodeCommand } from '../commands/validate-promo-code.command';
import { OrderPricingService } from '../services/order-pricing.service';

@Injectable()
export class ValidatePromoCodeHandler {
  constructor(private readonly orderPricingService: OrderPricingService) {}

  async execute(command: ValidatePromoCodeCommand): Promise<Result<any, Error>> {
    try {
      const pricing = await this.orderPricingService.prepare(command.items, command.promoCode);
      return ok(pricing);
    } catch (error) {
      return fail(error as Error);
    }
  }
}
