import { DomainException } from '../../shared/exceptions/domain-exception';

export class PromoCodeNotFoundError extends DomainException {
  constructor(code: string) {
    super(`Promo code not found: ${code}`, 'PROMO_CODE_NOT_FOUND');
  }
}

export class InvalidPromoCodeDiscountTypeError extends DomainException {
  constructor(type: string) {
    super(`Invalid promo code discount type: ${type}`, 'INVALID_PROMO_CODE_DISCOUNT_TYPE');
  }
}

export class PromoCodeExpiredError extends DomainException {
  constructor(code: string) {
    super(`Promo code has expired: ${code}`, 'PROMO_CODE_EXPIRED');
  }
}

export class PromoCodeInactiveError extends DomainException {
  constructor(code: string) {
    super(`Promo code is inactive: ${code}`, 'PROMO_CODE_INACTIVE');
  }
}

export class PromoCodeUsageLimitExceededError extends DomainException {
  constructor(code: string) {
    super(`Promo code usage limit exceeded: ${code}`, 'PROMO_CODE_USAGE_LIMIT_EXCEEDED');
  }
}

export class PromoCodeNotApplicableError extends DomainException {
  constructor(code: string) {
    super(`Promo code is not applicable to selected products: ${code}`, 'PROMO_CODE_NOT_APPLICABLE');
  }
}

export class InvalidPromoCodeConfigurationError extends DomainException {
  constructor(reason: string) {
    super(`Invalid promo code configuration: ${reason}`, 'INVALID_PROMO_CODE_CONFIGURATION');
  }
}
