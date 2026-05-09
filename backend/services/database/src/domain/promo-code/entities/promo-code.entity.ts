import { Entity } from '../../../shared/entity.base';
import { PromoCodeDiscountType } from '../value-objects/promo-code-discount-type.vo';

export interface PromoCodeProps {
  code: string;
  discountType: PromoCodeDiscountType;
  discountValue: number;
  usageLimit?: number | null;
  usedCount: number;
  isActive: boolean;
  isInfinite: boolean;
  expiresAt?: Date | null;
  applicableProductTypes: string[];
  minProductPrice?: number | null;
  maxProductPrice?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export class PromoCodeEntity extends Entity<string, PromoCodeProps> {
  get code(): string {
    return this.props.code;
  }

  get discountType(): PromoCodeDiscountType {
    return this.props.discountType;
  }

  get discountValue(): number {
    return this.props.discountValue;
  }

  get usageLimit(): number | null | undefined {
    return this.props.usageLimit;
  }

  get usedCount(): number {
    return this.props.usedCount;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get isInfinite(): boolean {
    return this.props.isInfinite;
  }

  get expiresAt(): Date | null | undefined {
    return this.props.expiresAt;
  }

  get applicableProductTypes(): string[] {
    return this.props.applicableProductTypes;
  }

  get minProductPrice(): number | null | undefined {
    return this.props.minProductPrice;
  }

  get maxProductPrice(): number | null | undefined {
    return this.props.maxProductPrice;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  isExpired(now: Date = new Date()): boolean {
    return !this.isInfinite && !!this.expiresAt && this.expiresAt.getTime() < now.getTime();
  }

  hasUsageRemaining(): boolean {
    return this.usageLimit == null || this.usedCount < this.usageLimit;
  }

  supportsProductType(type?: string): boolean {
    if (!this.applicableProductTypes.length) return true;
    if (!type) return false;
    return this.applicableProductTypes.some(
      supportedType => supportedType.toLowerCase() === type.toLowerCase(),
    );
  }

  supportsPrice(unitPrice: number): boolean {
    if (this.minProductPrice != null && unitPrice < this.minProductPrice) {
      return false;
    }

    if (this.maxProductPrice != null && unitPrice > this.maxProductPrice) {
      return false;
    }

    return true;
  }

  incrementUsage(): void {
    const updated = this.updateProps('usedCount', this.usedCount + 1);
    Object.assign(this.props, { ...updated, updatedAt: new Date() });
  }

  static create(
    id: string,
    code: string,
    discountType: PromoCodeDiscountType,
    discountValue: number,
    usageLimit: number | null | undefined,
    usedCount: number,
    isActive: boolean,
    isInfinite: boolean,
    expiresAt: Date | null | undefined,
    applicableProductTypes: string[],
    minProductPrice: number | null | undefined,
    maxProductPrice: number | null | undefined,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ): PromoCodeEntity {
    return new PromoCodeEntity(id, {
      code: code.trim().toUpperCase(),
      discountType,
      discountValue,
      usageLimit,
      usedCount,
      isActive,
      isInfinite,
      expiresAt,
      applicableProductTypes,
      minProductPrice,
      maxProductPrice,
      createdAt,
      updatedAt,
    });
  }

  /** Domain-level clone with new props (same id). */
  static withProps(id: string, props: PromoCodeProps): PromoCodeEntity {
    return new PromoCodeEntity(id, props);
  }
}
