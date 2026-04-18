import { DomainException } from '../../shared/exceptions/domain-exception';

export class InvalidPriceException extends DomainException {
  constructor(price: number) {
    super(`Invalid price: ${price}. Price must be positive.`, 'INVALID_PRICE');
  }
}

export class InvalidDiscountException extends DomainException {
  constructor(discount: number) {
    super(`Invalid discount: ${discount}. Discount must be between 0 and 100.`, 'INVALID_DISCOUNT');
  }
}

export class InvalidProductNameException extends DomainException {
  constructor(name: string) {
    super(`Invalid product name: ${name}. Name must be non-empty and less than 255 characters.`, 'INVALID_PRODUCT_NAME');
  }
}

export class ProductNotFoundError extends DomainException {
  constructor(id?: string, name?: string) {
    const detail = id ? `id: ${id}` : name ? `name: ${name}` : 'unknown';
    super(`Product not found (${detail})`, 'PRODUCT_NOT_FOUND');
  }
}

export class InvalidAttributeException extends DomainException {
  constructor(reason: string) {
    super(`Invalid product attribute: ${reason}`, 'INVALID_ATTRIBUTE');
  }
}
