/**
 * Product DTOs for type safety
 * SOLID Principle: Single Responsibility
 * Defines data transfer objects for product operations
 */

export interface IProduct {
  id: string;
  name: string;
  category?: string;
  type?: string;
  color?: string;
  price: number;
  discount?: number;
  image?: string;
  attributes?: Record<string, any>;
  [key: string]: any;
}

export interface IGetProductsParams {
  take: number;
  page: number;
  cursor?: string;
}

export interface IGetProductByNameParams {
  name: string;
}
