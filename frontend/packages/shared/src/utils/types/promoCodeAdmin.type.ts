export type PromoCodeAdminRow = {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  isInfinite: boolean;
  expiresAt: string | null;
  applicableProductTypes: string[];
  minProductPrice: number | null;
  maxProductPrice: number | null;
  createdAt: string;
  updatedAt: string;
};

export const PROMO_PRODUCT_TYPES = ['hoodie', 'sweatshirt', 'shirt', 'tshirt'] as const;

export const PROMO_DISCOUNT_TYPES = ['Percentage', 'FixedAmount'] as const;
