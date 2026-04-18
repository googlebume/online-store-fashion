import { Injectable } from '@nestjs/common';
import { Result, ok, fail } from '../../../shared/result';
import { ProductEntity } from '../../../domain/product/entities/product.entity';
import { ProductName } from '../../../domain/product/value-objects/product-name.vo';
import {
  IProductRepository,
  ProductQueryOptions,
  PaginatedResult,
  PRODUCT_REPOSITORY_PORT,
} from '../../../domain/product/ports/product-repository.port';
import { ProductNotFoundError } from '../../../domain/product/exceptions/product.exceptions';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Result<ProductEntity, Error>> {
    try {
      const product = await this.prisma.products.findUnique({ where: { id } });
      if (!product) return fail(new ProductNotFoundError(id));
      return ok(ProductMapper.toDomain(product));
    } catch (error) {
      return fail(new Error(`Failed to find product by id: ${error}`));
    }
  }

  async findByIdWithAttributes(id: string): Promise<Result<ProductEntity, Error>> {
    try {
      const product = await this.prisma.products.findUnique({
        where: { id },
        include: { attributes: true },
      });
      if (!product) return fail(new ProductNotFoundError(id));
      return ok(ProductMapper.toDomain(product));
    } catch (error) {
      return fail(new Error(`Failed to find product with attributes: ${error}`));
    }
  }

  async findByName(name: ProductName | string): Promise<Result<ProductEntity[], Error>> {
    try {
      const searchTerm = typeof name === 'string' ? name : name.toString();
      const products = await this.prisma.products.findMany({
        where: { name: { startsWith: searchTerm } },
        include: { attributes: true },
      });
      return ok(products.map(p => ProductMapper.toDomain(p)));
    } catch (error) {
      return fail(new Error(`Failed to find products by name: ${error}`));
    }
  }

  async findAll(options?: ProductQueryOptions): Promise<Result<ProductEntity[], Error>> {
    try {
      const products = await this.prisma.products.findMany(
        this.buildQueryOptions(options),
      );
      return ok(products.map(p => ProductMapper.toDomain(p)));
    } catch (error) {
      return fail(new Error(`Failed to find all products: ${error}`));
    }
  }

  async findAllWithAttributes(options?: ProductQueryOptions): Promise<Result<ProductEntity[], Error>> {
    try {
      const products = await this.prisma.products.findMany({
        ...this.buildQueryOptions(options),
        include: { attributes: true },
      });
      return ok(products.map(p => ProductMapper.toDomain(p)));
    } catch (error) {
      return fail(new Error(`Failed to find all products with attributes: ${error}`));
    }
  }

  async findPaginated(options: ProductQueryOptions): Promise<Result<PaginatedResult<ProductEntity>, Error>> {
    try {
      const { limit = 10, page = 1 } = options.pagination || {};
      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        this.prisma.products.findMany({
          ...this.buildQueryOptions(options),
          take: limit,
          skip,
        }),
        this.prisma.products.count(),
      ]);

      const lastItem = products[products.length - 1];
      const nextCursor = lastItem?.id || null;

      return ok({
        data: products.map(p => ProductMapper.toDomain(p)),
        meta: {
          total,
          page,
          limit,
          hasMore: skip + limit < total,
          cursor: nextCursor,
        },
      });
    } catch (error) {
      return fail(new Error(`Failed to find paginated products: ${error}`));
    }
  }

  async search(filter: Record<string, any>, options?: ProductQueryOptions): Promise<Result<ProductEntity[], Error>> {
    try {
      const products = await this.prisma.products.findMany({
        where: filter,
        ...this.buildQueryOptions(options),
      });
      return ok(products.map(p => ProductMapper.toDomain(p)));
    } catch (error) {
      return fail(new Error(`Failed to search products: ${error}`));
    }
  }

  async count(filter?: Record<string, any>): Promise<Result<number, Error>> {
    try {
      const count = await this.prisma.products.count({
        ...(filter && { where: filter }),
      });
      return ok(count);
    } catch (error) {
      return fail(new Error(`Failed to count products: ${error}`));
    }
  }

  async save(product: ProductEntity): Promise<Result<ProductEntity, Error>> {
    try {
      const data = ProductMapper.toPersistence(product);
      const created = await this.prisma.products.create({ data });
      return ok(ProductMapper.toDomain(created));
    } catch (error) {
      return fail(new Error(`Failed to save product: ${error}`));
    }
  }

  async update(id: string, partial: any): Promise<Result<ProductEntity, Error>> {
    try {
      const product = await this.prisma.products.findUnique({ where: { id } });
      if (!product) return fail(new ProductNotFoundError(id));

      const updated = await this.prisma.products.update({
        where: { id },
        data: partial,
      });
      return ok(ProductMapper.toDomain(updated));
    } catch (error) {
      return fail(new Error(`Failed to update product: ${error}`));
    }
  }

  async delete(id: string): Promise<Result<void, Error>> {
    try {
      const product = await this.prisma.products.findUnique({ where: { id } });
      if (!product) return fail(new ProductNotFoundError(id));

      await this.prisma.attributes.deleteMany({ where: { productsId: id } });
      await this.prisma.products.delete({ where: { id } });
      return ok(undefined);
    } catch (error) {
      return fail(new Error(`Failed to delete product: ${error}`));
    }
  }

  private buildQueryOptions(options?: ProductQueryOptions): Record<string, any> {
    const queryOpts: Record<string, any> = {};
    if (options?.orderBy) queryOpts.orderBy = options.orderBy;
    return queryOpts;
  }
}
