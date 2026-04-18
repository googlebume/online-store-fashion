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
  total: number;
  createdAt: Date;
  updatedAt: Date;
  items?: any[];
};

export class OrderMapper {
  static toDomain(raw: PrismaOrder): OrderEntity {
    const status = OrderStatus.create(raw.status);
    const deliveryMethod = DeliveryMethod.create(raw.deliveryMethod);
    const total = Money.create(raw.total);

    if (!status.ok || !deliveryMethod.ok || !total.ok) {
      throw new Error('Failed to map Prisma order to domain entity');
    }

    const items = raw.items?.map(item => {
      const priceResult = Money.create(item.price);
      if (!priceResult.ok) throw priceResult.error;
      return OrderItemEntity.create(
        item.id,
        raw.id,
        item.productId,
        item.quantity,
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
      total.value,
      items,
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
      total: entity.total.amount,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
