export class CreatePromoCodeCommand {
  constructor(
    readonly code: string,
    readonly discountType: string,
    readonly discountValue: number,
    readonly usageLimit?: number,
    readonly isInfinite: boolean = false,
    readonly isActive: boolean = true,
    readonly expiresAt?: string,
    readonly applicableProductTypes: string[] = [],
    readonly minProductPrice?: number,
    readonly maxProductPrice?: number,
  ) {}
}
