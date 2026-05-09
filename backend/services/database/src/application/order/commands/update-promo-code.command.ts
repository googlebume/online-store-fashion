export class UpdatePromoCodeCommand {
  constructor(
    readonly id: string,
    readonly code?: string,
    readonly discountType?: string,
    readonly discountValue?: number,
    readonly usageLimit?: number | null,
    readonly isInfinite?: boolean,
    readonly isActive?: boolean,
    readonly expiresAt?: string | null,
    readonly applicableProductTypes?: string[],
    readonly minProductPrice?: number | null,
    readonly maxProductPrice?: number | null,
  ) {}
}
