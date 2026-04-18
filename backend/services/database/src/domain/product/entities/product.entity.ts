import { Entity } from '../../../shared/entity.base';
import { ProductName } from '../value-objects/product-name.vo';
import { Price } from '../value-objects/price.vo';
import { Discount } from '../value-objects/discount.vo';
import { ProductAttributesEntity } from './product-attributes.entity';

export interface ProductProps {
  name: ProductName;
  description: string;
  price: Price;
  discount: Discount;
  brand: string;
  image: string;
  attributes?: ProductAttributesEntity[];
  createdAt: Date;
  updatedAt: Date;
}

export class ProductEntity extends Entity<string, ProductProps> {
  get name(): ProductName {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get price(): Price {
    return this.props.price;
  }

  get discount(): Discount {
    return this.props.discount;
  }

  get brand(): string {
    return this.props.brand;
  }

  get image(): string {
    return this.props.image;
  }

  get attributes(): ProductAttributesEntity[] | undefined {
    return this.props.attributes;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  getPriceAfterDiscount(): Price {
    if (!this.discount.isApplied()) return this.price;
    return this.price.applyDiscount(this.discount.percent);
  }

  updateName(name: ProductName): void {
    const updated = this.updateProps('name', name);
    Object.assign(this.props, { ...updated, updatedAt: new Date() });
  }

  updatePrice(price: Price): void {
    const updated = this.updateProps('price', price);
    Object.assign(this.props, { ...updated, updatedAt: new Date() });
  }

  updateDiscount(discount: Discount): void {
    const updated = this.updateProps('discount', discount);
    Object.assign(this.props, { ...updated, updatedAt: new Date() });
  }

  updateImage(image: string): void {
    const updated = this.updateProps('image', image);
    Object.assign(this.props, { ...updated, updatedAt: new Date() });
  }

  setAttributes(attributes: ProductAttributesEntity[]): void {
    const updated = this.updateProps('attributes', attributes);
    Object.assign(this.props, { ...updated, updatedAt: new Date() });
  }

  static create(
    id: string,
    name: ProductName,
    description: string,
    price: Price,
    discount: Discount,
    brand: string,
    image: string = '',
    attributes?: ProductAttributesEntity[],
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ): ProductEntity {
    return new ProductEntity(id, {
      name,
      description,
      price,
      discount,
      brand,
      image,
      attributes,
      createdAt,
      updatedAt,
    });
  }
}
