import { UserEntity } from '../../domain/user/entities/user.entity';
import { ProductEntity } from '../../domain/product/entities/product.entity';
import { ReviewEntity } from '../../domain/review/entities/review.entity';
import { OrderEntity } from '../../domain/order/entities/order.entity';
import { ProductAttributesEntity } from '../../domain/product/entities/product-attributes.entity';
import { OrderItemEntity } from '../../domain/order/entities/order-item.entity';
import { PromoCodeEntity } from '../../domain/promo-code/entities/promo-code.entity';

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

  static productToObject(entity: ProductEntity | any): any {
    // Cached plain objects store data under `props` (class instance own properties after JSON round-trip)
    const props = entity.props;
    const name     = entity.name     ?? props?.name;
    const price    = entity.price    ?? props?.price;
    const discount = entity.discount ?? props?.discount;
    const attrs    = entity.attributes ?? props?.attributes;

    return {
      id: entity.id,
      name: name?.value ?? String(name ?? ''),
      description: entity.description ?? props?.description,
      price: price?.value ?? price,
      discount: discount?.percent ?? discount,
      brand: entity.brand ?? props?.brand,
      image: entity.image ?? props?.image,
      attributes: attrs?.map((attr: any) => this.attributesToObject(attr)),
      createdAt: entity.createdAt ?? props?.createdAt,
      updatedAt: entity.updatedAt ?? props?.updatedAt,
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
      subtotal: entity.subtotal.amount,
      promoDiscountTotal: entity.promoDiscountTotal.amount,
      total: entity.total.amount,
      promoCodeId: entity.promoCodeId ?? null,
      promoCode: entity.promoCode ?? null,
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
      originalPrice: entity.originalPrice.amount,
      discountAmount: entity.discountAmount.amount,
      price: entity.price.amount,
    };
  }

  static promoCodeToObject(entity: PromoCodeEntity): any {
    return {
      id: entity.id,
      code: entity.code,
      discountType: entity.discountType.toString(),
      discountValue: entity.discountValue,
      usageLimit: entity.usageLimit ?? null,
      usedCount: entity.usedCount,
      isActive: entity.isActive,
      isInfinite: entity.isInfinite,
      expiresAt: entity.expiresAt instanceof Date ? entity.expiresAt.toISOString() : entity.expiresAt ?? null,
      applicableProductTypes: entity.applicableProductTypes,
      minProductPrice: entity.minProductPrice ?? null,
      maxProductPrice: entity.maxProductPrice ?? null,
      createdAt: entity.createdAt instanceof Date ? entity.createdAt.toISOString() : entity.createdAt,
      updatedAt: entity.updatedAt instanceof Date ? entity.updatedAt.toISOString() : entity.updatedAt,
    };
  }

  static reviewToObject(entity: ReviewEntity): any {
    return {
      id: entity.id,
      userId: entity.userId,
      userName: entity.userName,
      reviewTitle: entity.reviewTitle,
      text: entity.text,
      stars: entity.stars.value,
      createdAt: entity.createdAt.toISOString(),
    };
  }
}
