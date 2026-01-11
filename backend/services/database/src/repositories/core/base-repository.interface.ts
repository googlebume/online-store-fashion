import { ICreateInput, IQueryOptions, IUpdateInput, IPaginatedResult, EntityId, IQueryFilter } from './types';

/**
 * Base Repository Interface - SOLID Principle: Interface Segregation
 * Every specific repository implements this contract
 */
export interface IBaseRepository<T> {
  /**
   * Find entity by ID
   */
  findById(id: EntityId, options?: IQueryOptions): Promise<T | null>;

  /**
   * Find entities by filter
   */
  find(filter: IQueryFilter, options?: IQueryOptions): Promise<T[]>;

  /**
   * Find all entities
   */
  findAll(options?: IQueryOptions): Promise<T[]>;

  /**
   * Find one entity by filter
   */
  findOne(filter: IQueryFilter, options?: IQueryOptions): Promise<T | null>;

  /**
   * Find with pagination
   */
  findPaginated(
    filter: IQueryFilter,
    options?: IQueryOptions
  ): Promise<IPaginatedResult<T>>;

  /**
   * Create entity
   */
  create(data: ICreateInput<T>): Promise<T>;

  /**
   * Create multiple entities
   */
  createMany(data: ICreateInput<T>[]): Promise<T[]>;

  /**
   * Update entity by ID
   */
  updateById(id: EntityId, data: IUpdateInput<T>): Promise<T>;

  /**
   * Update entities by filter
   */
  update(filter: IQueryFilter, data: IUpdateInput<T>): Promise<T[]>;

  /**
   * Delete entity by ID
   */
  deleteById(id: EntityId): Promise<void>;

  /**
   * Delete entities by filter
   */
  delete(filter: IQueryFilter): Promise<number>;

  /**
   * Check if entity exists
   */
  exists(filter: IQueryFilter): Promise<boolean>;

  /**
   * Count entities
   */
  count(filter?: IQueryFilter): Promise<number>;
}
