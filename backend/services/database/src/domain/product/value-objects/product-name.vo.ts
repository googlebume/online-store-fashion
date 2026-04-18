import { Result, ok, fail } from '../../../shared/result';
import { InvalidProductNameException } from '../exceptions/product.exceptions';

export class ProductName {
  private constructor(readonly value: string) {}

  static create(name: string): Result<ProductName, InvalidProductNameException> {
    if (!name || typeof name !== 'string') {
      return fail(new InvalidProductNameException(name));
    }

    const trimmed = name.trim();
    if (trimmed.length === 0 || trimmed.length > 255) {
      return fail(new InvalidProductNameException(name));
    }

    return ok(new ProductName(trimmed));
  }

  equals(other: ProductName): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
