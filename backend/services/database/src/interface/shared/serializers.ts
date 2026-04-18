import { UserEntity } from '../../domain/user/entities/user.entity';
import { ProductEntity } from '../../domain/product/entities/product.entity';
import { OrderEntity } from '../../domain/order/entities/order.entity';
import { ProductAttributesEntity } from '../../domain/product/entities/product-attributes.entity';
import { OrderItemEntity } from '../../domain/order/entities/order-item.entity';

export class Serializers {
  static userToObject(entity: UserEntity): any {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email.value,
      role: entity.role.toString(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static productToObject(entity: ProductEntity): any {
    return {
      id: entity.id,
      name: entity.name.toString(),
      description: entity.description,
      price: entity.price.value,
      discount: entity.discount.percent,
      brand: entity.brand,
      image: entity.image,
      attributes: entity.attributes?.map(attr => this.attributesToObject(attr)),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static attributesToObject(entity: ProductAttributesEntity): any {
    return {
      id: entity.id,
      productsId: entity.productsId,
      type: entity.type,
      category: entity.category,
      color: entity.color,
      size: entity.size,
      material: entity.material,
      countryOfOrigin: entity.countryOfOrigin,
      weight: entity.weight,
    };
  }

  static orderToObject(entity: OrderEntity): any {
    return {
      id: entity.id,
      userId: entity.userId,
      status: entity.status.toString(),
      deliveryMethod: entity.deliveryMethod.toString(),
      address: entity.address,
      email: entity.email,
      total: entity.total.amount,
      items: entity.items?.map(item => this.orderItemToObject(item)),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static orderItemToObject(entity: OrderItemEntity): any {
    return {
      id: entity.id,
      orderId: entity.orderId,
      productId: entity.productId,
      quantity: entity.quantity,
      price: entity.price.amount,
    };
  }
}
