import { Entity } from '../../../shared/entity.base';
import { Money } from '../value-objects/money.vo';

export interface OrderItemProps {
  orderId: string;
  productId: string;
  quantity: number;
  price: Money;
}

export class OrderItemEntity extends Entity<string, OrderItemProps> {
  get orderId(): string {
    return this.props.orderId;
  }

  get productId(): string {
    return this.props.productId;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get price(): Money {
    return this.props.price;
  }

  getSubtotal(): Money {
    const subtotal = this.price.amount * this.quantity;
    const result = Money.create(subtotal);
    if (!result.ok) throw result.error;
    return result.value;
  }

  static create(
    id: string,
    orderId: string,
    productId: string,
    quantity: number,
    price: Money,
  ): OrderItemEntity {
    return new OrderItemEntity(id, {
      orderId,
      productId,
      quantity,
      price,
    });
  }
}
