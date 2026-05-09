import { trackAnalytics } from './trackAnalytics';
import { getFirebaseAnalytics } from '../firebase/initFirebase';

/**
 * Фіксує успішне замовлення з промокодом: analytics-service (БД) + GA4 MP + Firebase Analytics (клієнт).
 * Для підрахунку унікальних користувачів по промокоду використовуйте агрегацію подій `promo_order_completed`
 * (поле userId у записі події в БД).
 */
export function trackPromoOrderCompleted(args: {
  promoCode: string;
  orderId?: string;
  promoDiscountTotal: number;
}): void {
  const promo_code = args.promoCode.trim().toUpperCase();

  trackAnalytics({
    name: 'promo_order_completed',
    payload: {
      promo_code,
      order_id: args.orderId ?? '',
      promo_discount_total: args.promoDiscountTotal,
    },
  });

  void (async () => {
    try {
      const fa = getFirebaseAnalytics();
      if (!fa) return;
      const { logEvent } = await import('firebase/analytics');
      logEvent(fa, 'promo_order_completed', {
        promo_code,
        ...(args.orderId ? { order_id: args.orderId } : {}),
        value: args.promoDiscountTotal,
      });
    } catch {
      /* Firebase може бути недоступний у частини збірок */
    }
  })();
}
