import { Result, ok, fail } from '../../../shared/result';
import { InvalidPriceException } from '../exceptions/product.exceptions';

export class Price {
  private constructor(readonly value: number) {}

  static create(price: number): Result<Price, InvalidPriceException> {
    if (typeof price !== 'number' || price < 0 || !isFinite(price)) {
      return fail(new InvalidPriceException(price));
    }
    return ok(new Price(Math.round(price * 100) / 100));
  }

  equals(other: Price): boolean {
    return this.value === other.value;
  }

  isGreaterThan(other: Price): boolean {
    return this.value > other.value;
  }

  isLessThan(other: Price): boolean {
    return this.value < other.value;
  }

  add(other: Price): Price {
    return new Price(this.value + other.value);
  }

  subtract(other: Price): Price {
    return new Price(Math.max(0, this.value - other.value));
  }

  applyDiscount(discountPercent: number): Price {
    const discount = (this.value * discountPercent) / 100;
    return new Price(Math.round((this.value - discount) * 100) / 100);
  }

  toString(): string {
    return this.value.toFixed(2);
  }
}
