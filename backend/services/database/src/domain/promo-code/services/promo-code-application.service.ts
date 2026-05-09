import {
  PromoCodeExpiredError,
  PromoCodeInactiveError,
  PromoCodeNotApplicableError,
  PromoCodeUsageLimitExceededError,
} from '../exceptions/promo-code.exceptions';
import { PromoCodeEntity } from '../entities/promo-code.entity';

export interface PromoCodeProductCandidate {
  productId: string;
  quantity: number;
  unitPrice: number;
  productType?: string;
}

export interface AppliedPromoCodeItem {
  productId: string;
  quantity: number;
  isEligible: boolean;
  unitPrice: number;
  originalLineTotal: number;
  discountPerUnit: number;
  discountTotal: number;
  finalLineTotal: number;
}

export interface PromoCodeApplicationResult {
  promoCodeId: string;
  promoCode: string;
  subtotal: number;
  discountTotal: number;
  total: number;
  appliedItems: AppliedPromoCodeItem[];
}

export class PromoCodeApplicationService {
  evaluate(
    promoCode: PromoCodeEntity,
    items: PromoCodeProductCandidate[],
    now: Date = new Date(),
  ): PromoCodeApplicationResult {
    if (!promoCode.isActive) {
      throw new PromoCodeInactiveError(promoCode.code);
    }

    if (promoCode.isExpired(now)) {
      throw new PromoCodeExpiredError(promoCode.code);
    }

    if (!promoCode.hasUsageRemaining()) {
      throw new PromoCodeUsageLimitExceededError(promoCode.code);
    }

    const appliedItems = items.map(item => {
      const isEligible =
        promoCode.supportsProductType(item.productType) &&
        promoCode.supportsPrice(item.unitPrice);

      const discountPerUnit = isEligible ? this.calculateDiscountPerUnit(promoCode, item.unitPrice) : 0;
      const originalLineTotal = this.round(item.unitPrice * item.quantity);
      const discountTotal = this.round(discountPerUnit * item.quantity);
      const finalLineTotal = this.round(Math.max(0, originalLineTotal - discountTotal));

      return {
        productId: item.productId,
        quantity: item.quantity,
        isEligible,
        unitPrice: this.round(item.unitPrice),
        originalLineTotal,
        discountPerUnit,
        discountTotal,
        finalLineTotal,
      };
    });

    const hasEligibleItems = appliedItems.some(item => item.isEligible);
    if (!hasEligibleItems) {
      throw new PromoCodeNotApplicableError(promoCode.code);
    }

    const subtotal = this.round(appliedItems.reduce((sum, item) => sum + item.originalLineTotal, 0));
    const discountTotal = this.round(appliedItems.reduce((sum, item) => sum + item.discountTotal, 0));
    const total = this.round(Math.max(0, subtotal - discountTotal));

    return {
      promoCodeId: promoCode.id,
      promoCode: promoCode.code,
      subtotal,
      discountTotal,
      total,
      appliedItems,
    };
  }

  private calculateDiscountPerUnit(promoCode: PromoCodeEntity, unitPrice: number): number {
    if (promoCode.discountType.isPercentage()) {
      return this.round(Math.min(unitPrice, unitPrice * (promoCode.discountValue / 100)));
    }

    return this.round(Math.min(unitPrice, promoCode.discountValue));
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
