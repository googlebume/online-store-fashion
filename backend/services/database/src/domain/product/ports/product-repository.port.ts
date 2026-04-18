import { Result } from '../../../shared/result';
import { ProductEntity } from '../entities/product.entity';
import { ProductName } from '../value-objects/product-name.vo';

export const PRODUCT_REPOSITORY_PORT = Symbol('IProductRepository');

export interface PaginationOptions {
  limit: number;
  page?: number;
  cursor?: string;
}

export interface ProductQueryOptions {
  pagination?: PaginationOptions;
  orderBy?: Record<string, 'asc' | 'desc'>;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
    cursor: string | null;
  };
}

export interface IProductRepository {
  findById(id: string): Promise<Result<ProductEntity>>;
  findByIdWithAttributes(id: string): Promise<Result<ProductEntity>>;
  findByName(name: ProductName | string): Promise<Result<ProductEntity[]>>;
  findAll(options?: ProductQueryOptions): Promise<Result<ProductEntity[]>>;
  findAllWithAttributes(options?: ProductQueryOptions): Promise<Result<ProductEntity[]>>;
  findPaginated(options: ProductQueryOptions): Promise<Result<PaginatedResult<ProductEntity>>>;
  search(filter: Record<string, any>, options?: ProductQueryOptions): Promise<Result<ProductEntity[]>>;
  count(filter?: Record<string, any>): Promise<Result<number>>;
  save(product: ProductEntity): Promise<Result<ProductEntity>>;
  update(id: string, partial: Partial<Omit<Record<keyof ProductEntity['props'], unknown>, 'name'>>): Promise<Result<ProductEntity>>;
  delete(id: string): Promise<Result<void>>;
}
