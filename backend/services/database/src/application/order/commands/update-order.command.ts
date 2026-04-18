export class UpdateOrderCommand {
  constructor(
    readonly id: string,
    readonly status?: string,
    readonly address?: string,
    readonly email?: string,
    readonly total?: number,
  ) {}
}
