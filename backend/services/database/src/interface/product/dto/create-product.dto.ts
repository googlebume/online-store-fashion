export class CreateProductDTO {
  name: string;
  description: string;
  price: number;
  brand: string;
  discount?: number;
  image?: string;
  attributes?: {
    type?: string;
    category?: string;
    color?: string;
    size?: string;
    material?: string;
    countryOfOrigin?: string;
    weight?: number;
  };
}
