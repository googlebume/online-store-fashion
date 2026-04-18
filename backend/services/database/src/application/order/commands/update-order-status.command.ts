export class UpdateOrderStatusCommand {
  constructor(
    readonly orderId: string,
    readonly status: string,
  ) {}
}
