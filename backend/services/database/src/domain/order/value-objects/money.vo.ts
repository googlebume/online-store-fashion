import { Result, ok, fail } from '../../../shared/result';
import { InvalidMoneyException } from '../exceptions/order.exceptions';

export class Money {
  private constructor(readonly amount: number) {}

  static create(amount: number): Result<Money, InvalidMoneyException> {
    if (typeof amount !== 'number' || amount < 0 || !isFinite(amount)) {
      return fail(new InvalidMoneyException(amount));
    }
    return ok(new Money(Math.round(amount * 100) / 100));
  }

  static zero(): Money {
    return new Money(0);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount;
  }

  isZero(): boolean {
    return this.amount === 0;
  }

  isPositive(): boolean {
    return this.amount > 0;
  }

  isGreaterThan(other: Money): boolean {
    return this.amount > other.amount;
  }

  add(other: Money): Money {
    return new Money(this.amount + other.amount);
  }

  subtract(other: Money): Money {
    return new Money(Math.max(0, this.amount - other.amount));
  }

  toString(): string {
    return this.amount.toFixed(2);
  }
}
