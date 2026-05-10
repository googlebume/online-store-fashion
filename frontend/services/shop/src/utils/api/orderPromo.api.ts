import { api } from '@packages/shared/src/routes/api';
import { getCartItems } from '@shop/state/basketState';

const ORDER_SERVICE_PORT = 5005;

export type PromoPricingDto = {
  subtotal: number;
  promoDiscountTotal: number;
  total: number;
  promoCodeId?: string;
  promoCode?: string;
};

type ValidateResponse = {
  success?: boolean;
  message?: string;
  data?: PromoPricingDto;
};

function extractPricingPayload(body: ValidateResponse | PromoPricingDto): PromoPricingDto | null {
  if (!body || typeof body !== 'object') return null;
  const anyBody = body as Record<string, unknown>;
  if (anyBody.success === false) return null;
  if (
    anyBody.data &&
    typeof anyBody.data === 'object' &&
    typeof (anyBody.data as PromoPricingDto).total === 'number'
  ) {
    return anyBody.data as PromoPricingDto;
  }
  if (typeof anyBody.total === 'number') {
    return body as PromoPricingDto;
  }
  return null;
}

/**
 * Перевірка промокоду по поточному кошику (order-service → database).
 * Публічний ендпоінт, без JWT.
 */
export async function validatePromoCode(promoCode: string): Promise<PromoPricingDto> {
  const trimmed = promoCode.trim();
  if (!trimmed) {
    throw new Error('Введіть промокод');
  }

  const items = getCartItems().map((item) => ({
    productId: item.id,
    quantity: item.quantity,
  }));

  if (items.length === 0) {
    throw new Error('Кошик порожній');
  }

  const origin = `http://localhost:${ORDER_SERVICE_PORT}`;
  const res = await fetch(`${origin}/${api}/ordering/promocodes/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ promoCode: trimmed, items }),
  });

  let body: ValidateResponse | PromoPricingDto = {};
  try {
    body = (await res.json()) as ValidateResponse | PromoPricingDto;
  } catch {
    /* ignore */
  }

  if (!res.ok) {
    const msg =
      typeof body === 'object' && body !== null && 'message' in body && typeof (body as ValidateResponse).message === 'string'
        ? (body as ValidateResponse).message
        : undefined;
    throw new Error(msg || 'Промокод недійсний або не застосовується до кошика');
  }

  if (typeof body === 'object' && body !== null && 'success' in body && (body as ValidateResponse).success === false) {
    throw new Error((body as ValidateResponse).message || 'Промокод недійсний або не застосовується до кошика');
  }

  const pricing = extractPricingPayload(body as ValidateResponse);
  if (!pricing) {
    throw new Error('Некоректна відповідь сервера');
  }

  return pricing;
}
