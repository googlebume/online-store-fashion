import type { PromoPricingDto } from '@shop/utils/api/orderPromo.api';

export type PromoBasketEvent =
  | { type: 'clear' }
  | { type: 'clear_field_error' }
  | { type: 'validating' }
  | { type: 'valid'; code: string; pricing: PromoPricingDto }
  | { type: 'invalid'; message: string };
