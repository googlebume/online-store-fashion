import { ProductEntity } from '../../../domain/product/entities/product.entity';
import { ProductAttributesEntity } from '../../../domain/product/entities/product-attributes.entity';
import { ProductName } from '../../../domain/product/value-objects/product-name.vo';
import { Price } from '../../../domain/product/value-objects/price.vo';
import { Discount } from '../../../domain/product/value-objects/discount.vo';

export type PrismaProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  brand: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  attributes?: any[];
};

export class ProductMapper {
  static toDomain(raw: PrismaProduct): ProductEntity {
    const name = ProductName.create(raw.name);
    const price = Price.create(raw.price);
    const discount = Discount.create(raw.discount);

    if (!name.ok || !price.ok || !discount.ok) {
      throw new Error('Failed to map Prisma product to domain entity');
    }

    const attributes = raw.attributes?.map(attr =>
      ProductAttributesEntity.create(
        `${raw.id}-attr-${attr.id || 0}`,
        raw.id,
        attr.type,
        attr.category,
        attr.color,
        attr.size,
        attr.material,
        attr.countryOfOrigin,
        attr.weight,
      ),
    );

    return ProductEntity.create(
      raw.id,
      name.value,
      raw.description,
      price.value,
      discount.value,
      raw.brand,
      raw.image,
      attributes,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  static toPersistence(entity: ProductEntity): any {
    return {
      id: entity.id,
      name: entity.name.toString(),
      description: entity.description,
      price: entity.price.value,
      discount: entity.discount.percent,
      brand: entity.brand,
      image: entity.image,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
