import { Entity } from '../../../shared/entity.base';

export interface ProductAttributesProps {
  productsId: string;
  type?: string;
  category?: string;
  color?: string;
  size?: string;
  material?: string;
  countryOfOrigin?: string;
  weight?: number;
}

export class ProductAttributesEntity extends Entity<string, ProductAttributesProps> {
  get productsId(): string {
    return this.props.productsId;
  }

  get type(): string | undefined {
    return this.props.type;
  }

  get category(): string | undefined {
    return this.props.category;
  }

  get color(): string | undefined {
    return this.props.color;
  }

  get size(): string | undefined {
    return this.props.size;
  }

  get material(): string | undefined {
    return this.props.material;
  }

  get countryOfOrigin(): string | undefined {
    return this.props.countryOfOrigin;
  }

  get weight(): number | undefined {
    return this.props.weight;
  }

  static create(
    id: string,
    productsId: string,
    type?: string,
    category?: string,
    color?: string,
    size?: string,
    material?: string,
    countryOfOrigin?: string,
    weight?: number,
  ): ProductAttributesEntity {
    return new ProductAttributesEntity(id, {
      productsId,
      type,
      category,
      color,
      size,
      material,
      countryOfOrigin,
      weight,
    });
  }
}
