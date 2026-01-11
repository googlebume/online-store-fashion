/**
 * Core types for repository pattern
 */

export interface IQueryFilter {
  [key: string]: any;
}

export interface IPaginationMeta {
  total?: number;
  page: number;
  limit: number;
  hasMore?: boolean;
  cursor?: string;
}

export interface IPaginatedResult<T> {
  data: T[];
  meta: IPaginationMeta;
}

export interface IQueryOptions {
  select?: Record<string, boolean>;
  include?: Record<string, any>;
  orderBy?: Record<string, 'asc' | 'desc'>;
  pagination?: {
    limit: number;
    page?: number;
    cursor?: string;
  };
}

export interface ICreateInput<T> {
  [key: string]: any;
}

export interface IUpdateInput<T> {
  [key: string]: any;
}

export type EntityId = string | number;
