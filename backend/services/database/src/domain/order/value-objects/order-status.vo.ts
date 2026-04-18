import { Result, ok, fail } from '../../../shared/result';
import { InvalidOrderStatusException } from '../exceptions/order.exceptions';

export enum OrderStatusEnum {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  DELIVERED = 'Delivered',
  RECEIVED = 'Received',
  DECLINED = 'Declined',
  CANCELED = 'Canceled',
  ACCEPTED = 'Accepted',
}

export class OrderStatus {
  private constructor(readonly value: OrderStatusEnum) {}

  static create(raw: string): Result<OrderStatus, InvalidOrderStatusException> {
    const normalized = Object.values(OrderStatusEnum).find(
      s => s.toLowerCase() === raw?.toLowerCase().trim(),
    );

    if (!normalized) {
      return fail(new InvalidOrderStatusException(raw));
    }

    return ok(new OrderStatus(normalized as OrderStatusEnum));
  }

  static pending(): OrderStatus {
    return new OrderStatus(OrderStatusEnum.PENDING);
  }

  equals(other: OrderStatus): boolean {
    return this.value === other.value;
  }

  isPending(): boolean {
    return this.value === OrderStatusEnum.PENDING;
  }

  isProcessing(): boolean {
    return this.value === OrderStatusEnum.PROCESSING;
  }

  isDelivered(): boolean {
    return this.value === OrderStatusEnum.DELIVERED;
  }

  isCanceled(): boolean {
    return this.value === OrderStatusEnum.CANCELED;
  }

  isTerminal(): boolean {
    return this.isCanceled() || this.isDelivered() || this.isDeclined();
  }

  isDeclined(): boolean {
    return this.value === OrderStatusEnum.DECLINED;
  }

  toString(): string {
    return this.value;
  }
}
