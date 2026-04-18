export class UpdateProductCommand {
  constructor(
    readonly id: string,
    readonly name?: string,
    readonly description?: string,
    readonly price?: number,
    readonly brand?: string,
    readonly discount?: number,
    readonly image?: string,
    readonly attributes?: Record<string, any>,
  ) {}
}
