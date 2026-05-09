import { Result, fail, ok } from '../../../shared/result';
import { InvalidPromoCodeDiscountTypeError } from '../exceptions/promo-code.exceptions';

export enum PromoCodeDiscountTypeEnum {
  PERCENTAGE = 'Percentage',
  FIXED_AMOUNT = 'FixedAmount',
}

export class PromoCodeDiscountType {
  private constructor(readonly value: PromoCodeDiscountTypeEnum) {}

  static create(raw: string): Result<PromoCodeDiscountType, InvalidPromoCodeDiscountTypeError> {
    const normalized = Object.values(PromoCodeDiscountTypeEnum).find(
      value => value.toLowerCase() === raw?.trim().toLowerCase(),
    );

    if (!normalized) {
      return fail(new InvalidPromoCodeDiscountTypeError(raw));
    }

    return ok(new PromoCodeDiscountType(normalized));
  }

  isPercentage(): boolean {
    return this.value === PromoCodeDiscountTypeEnum.PERCENTAGE;
  }

  isFixedAmount(): boolean {
    return this.value === PromoCodeDiscountTypeEnum.FIXED_AMOUNT;
  }

  toString(): string {
    return this.value;
  }
}
