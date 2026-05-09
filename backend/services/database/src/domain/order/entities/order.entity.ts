import { Entity } from '../../../shared/entity.base';
import { OrderStatus } from '../value-objects/order-status.vo';
import { DeliveryMethod } from '../value-objects/delivery-method.vo';
import { Money } from '../value-objects/money.vo';
import { OrderItemEntity } from './order-item.entity';

export interface OrderProps {
  userId: string;
  status: OrderStatus;
  deliveryMethod: DeliveryMethod;
  address: string;
  email: string;
  subtotal: Money;
  promoDiscountTotal: Money;
  total: Money;
  promoCodeId?: string | null;
  promoCode?: string | null;
  items: OrderItemEntity[];
  createdAt: Date;
  updatedAt: Date;
}

export class OrderEntity extends Entity<string, OrderProps> {
  get userId(): string {
    return this.props.userId;
  }

  get status(): OrderStatus {
    return this.props.status;
  }

  get deliveryMethod(): DeliveryMethod {
    return this.props.deliveryMethod;
  }

  get address(): string {
    return this.props.address;
  }

  get email(): string {
    return this.props.email;
  }

  get subtotal(): Money {
    return this.props.subtotal;
  }

  get promoDiscountTotal(): Money {
    return this.props.promoDiscountTotal;
  }

  get total(): Money {
    return this.props.total;
  }

  get promoCodeId(): string | null | undefined {
    return this.props.promoCodeId;
  }

  get promoCode(): string | null | undefined {
    return this.props.promoCode;
  }

  get items(): OrderItemEntity[] {
    return this.props.items;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  itemCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  updateStatus(status: OrderStatus): void {
    const updated = this.updateProps('status', status);
    Object.assign(this.props, { ...updated, updatedAt: new Date() });
  }

  updateAddress(address: string): void {
    const updated = this.updateProps('address', address);
    Object.assign(this.props, { ...updated, updatedAt: new Date() });
  }

  updateEmail(email: string): void {
    const updated = this.updateProps('email', email);
    Object.assign(this.props, { ...updated, updatedAt: new Date() });
  }

  updateTotal(total: Money): void {
    const updated = this.updateProps('total', total);
    Object.assign(this.props, { ...updated, updatedAt: new Date() });
  }

  static create(
    id: string,
    userId: string,
    status: OrderStatus,
    deliveryMethod: DeliveryMethod,
    address: string,
    email: string,
    subtotal: Money,
    promoDiscountTotal: Money,
    total: Money,
    items: OrderItemEntity[],
    promoCodeId?: string | null,
    promoCode?: string | null,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ): OrderEntity {
    return new OrderEntity(id, {
      userId,
      status,
      deliveryMethod,
      address,
      email,
      subtotal,
      promoDiscountTotal,
      total,
      promoCodeId,
      promoCode,
      items,
      createdAt,
      updatedAt,
    });
  }
}
