import { PromoCodeEntity } from '../../../domain/promo-code/entities/promo-code.entity';
import { PromoCodeDiscountType } from '../../../domain/promo-code/value-objects/promo-code-discount-type.vo';

export type PrismaPromoCode = {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  usageLimit?: number | null;
  usedCount: number;
  isActive: boolean;
  isInfinite: boolean;
  expiresAt?: Date | null;
  minProductPrice?: number | null;
  maxProductPrice?: number | null;
  createdAt: Date;
  updatedAt: Date;
  applicableProductTypes?: Array<{ type: string }>;
};

export class PromoCodeMapper {
  static toDomain(raw: PrismaPromoCode): PromoCodeEntity {
    const discountType = PromoCodeDiscountType.create(raw.discountType);
    if (!discountType.ok) {
      throw discountType.error;
    }

    return PromoCodeEntity.create(
      raw.id,
      raw.code,
      discountType.value,
      raw.discountValue,
      raw.usageLimit,
      raw.usedCount,
      raw.isActive,
      raw.isInfinite,
      raw.expiresAt,
      raw.applicableProductTypes?.map(item => item.type) ?? [],
      raw.minProductPrice,
      raw.maxProductPrice,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  static toPersistence(entity: PromoCodeEntity): Record<string, unknown> {
    return {
      id: entity.id,
      code: entity.code,
      discountType: entity.discountType.toString(),
      discountValue: entity.discountValue,
      usageLimit: entity.usageLimit ?? null,
      usedCount: entity.usedCount,
      isActive: entity.isActive,
      isInfinite: entity.isInfinite,
      expiresAt: entity.expiresAt ?? null,
      minProductPrice: entity.minProductPrice ?? null,
      maxProductPrice: entity.maxProductPrice ?? null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
