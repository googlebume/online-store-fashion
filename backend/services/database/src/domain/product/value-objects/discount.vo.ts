import { Result, ok, fail } from '../../../shared/result';
import { InvalidDiscountException } from '../exceptions/product.exceptions';

export class Discount {
  private constructor(readonly percent: number) {}

  static create(percent: number): Result<Discount, InvalidDiscountException> {
    if (typeof percent !== 'number' || percent < 0 || percent > 100 || !isFinite(percent)) {
      return fail(new InvalidDiscountException(percent));
    }
    return ok(new Discount(Math.round(percent * 100) / 100));
  }

  static none(): Discount {
    return new Discount(0);
  }

  equals(other: Discount): boolean {
    return this.percent === other.percent;
  }

  isApplied(): boolean {
    return this.percent > 0;
  }

  toString(): string {
    return `${this.percent}%`;
  }
}
