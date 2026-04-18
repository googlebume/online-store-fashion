import { DomainException } from '../../shared/exceptions/domain-exception';

export class InvalidOrderStatusException extends DomainException {
  constructor(status: string) {
    super(`Invalid order status: ${status}`, 'INVALID_ORDER_STATUS');
  }
}

export class InvalidDeliveryMethodException extends DomainException {
  constructor(method: string) {
    super(`Invalid delivery method: ${method}`, 'INVALID_DELIVERY_METHOD');
  }
}

export class InvalidMoneyException extends DomainException {
  constructor(amount: number) {
    super(`Invalid money amount: ${amount}. Amount must be positive.`, 'INVALID_MONEY');
  }
}

export class OrderNotFoundError extends DomainException {
  constructor(id: string) {
    super(`Order not found (id: ${id})`, 'ORDER_NOT_FOUND');
  }
}

export class InvalidOrderItemException extends DomainException {
  constructor(reason: string) {
    super(`Invalid order item: ${reason}`, 'INVALID_ORDER_ITEM');
  }
}

export class EmptyOrderError extends DomainException {
  constructor() {
    super('Order cannot be empty. At least one item is required.', 'EMPTY_ORDER');
  }
}
