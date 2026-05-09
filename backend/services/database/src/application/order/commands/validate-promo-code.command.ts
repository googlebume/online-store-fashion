export interface ValidatePromoCodeItemInput {
  productId: string;
  quantity: number;
}

export class ValidatePromoCodeCommand {
  constructor(
    readonly promoCode: string,
    readonly items: ValidatePromoCodeItemInput[],
  ) {}
}
