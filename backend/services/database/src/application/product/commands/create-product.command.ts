export class CreateProductCommand {
  constructor(
    readonly name: string,
    readonly description: string,
    readonly price: number,
    readonly brand: string,
    readonly discount?: number,
    readonly image?: string,
    readonly attributes?: {
      type?: string;
      category?: string;
      color?: string;
      size?: string;
      material?: string;
      countryOfOrigin?: string;
      weight?: number;
    },
  ) {}
}
