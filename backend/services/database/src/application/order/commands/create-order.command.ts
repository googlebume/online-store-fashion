export interface OrderItemInput {
  productId: string;
  quantity: number;
  price: number;
}

export class CreateOrderCommand {
  constructor(
    readonly userId: string,
    readonly items: OrderItemInput[],
    readonly deliveryMethod: string,
    readonly address: string,
    readonly email: string,
    readonly total: number,
    readonly status?: string,
  ) {}
}
