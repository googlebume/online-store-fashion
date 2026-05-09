import { OrderEntity } from '../../../domain/order/entities/order.entity';
import { OrderItemEntity } from '../../../domain/order/entities/order-item.entity';
import { OrderStatus } from '../../../domain/order/value-objects/order-status.vo';
import { DeliveryMethod } from '../../../domain/order/value-objects/delivery-method.vo';
import { Money } from '../../../domain/order/value-objects/money.vo';

export type PrismaOrder = {
  id: string;
  userId: string;
  status: string;
  deliveryMethod: string;
  address: string;
  email: string;
  subtotal: number;
  promoDiscountTotal: number;
  total: number;
  promoCodeId?: string | null;
  promoCode?: { code: string } | null;
  createdAt: Date;
  updatedAt: Date;
  items?: Array<{
    id: string;
    productId: string;
    quantity: number;
    originalPrice: number;
    discountAmount: number;
    price: number;
  }>;
};

export class OrderMapper {
  static toDomain(raw: PrismaOrder): OrderEntity {
    const status = OrderStatus.create(raw.status);
    const deliveryMethod = DeliveryMethod.create(raw.deliveryMethod);
    const subtotal = Money.create(raw.subtotal ?? raw.total);
    const promoDiscountTotal = Money.create(raw.promoDiscountTotal ?? 0);
    const total = Money.create(raw.total);

    if (!status.ok || !deliveryMethod.ok || !subtotal.ok || !promoDiscountTotal.ok || !total.ok) {
      throw new Error('Failed to map Prisma order to domain entity');
    }

    const items = raw.items?.map(item => {
      const originalPriceResult = Money.create(item.originalPrice ?? item.price);
      const discountAmountResult = Money.create(item.discountAmount ?? 0);
      const priceResult = Money.create(item.price);
      if (!originalPriceResult.ok) throw originalPriceResult.error;
      if (!discountAmountResult.ok) throw discountAmountResult.error;
      if (!priceResult.ok) throw priceResult.error;
      return OrderItemEntity.create(
        item.id,
        raw.id,
        item.productId,
        item.quantity,
        originalPriceResult.value,
        discountAmountResult.value,
        priceResult.value,
      );
    }) || [];

    return OrderEntity.create(
      raw.id,
      raw.userId,
      status.value,
      deliveryMethod.value,
      raw.address,
      raw.email,
      subtotal.value,
      promoDiscountTotal.value,
      total.value,
      items,
      raw.promoCodeId,
      raw.promoCode?.code,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  static toPersistence(entity: OrderEntity): any {
    return {
      id: entity.id,
      userId: entity.userId,
      status: entity.status.toString(),
      deliveryMethod: entity.deliveryMethod.toString(),
      address: entity.address,
      email: entity.email,
      subtotal: entity.subtotal.amount,
      promoDiscountTotal: entity.promoDiscountTotal.amount,
      total: entity.total.amount,
      promoCodeId: entity.promoCodeId ?? null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
