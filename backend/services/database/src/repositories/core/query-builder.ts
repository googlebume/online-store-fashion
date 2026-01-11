/**
 * Query Builder - SOLID Principle: Single Responsibility
 * Handles only query construction logic
 */
export interface IQueryBuilderConfig {
  filters?: Record<string, any>;
  select?: Record<string, boolean>;
  include?: Record<string, any>;
  orderBy?: Record<string, 'asc' | 'desc'>;
  take?: number;
  skip?: number;
  cursor?: string;
}

export class QueryBuilder {
  private config: IQueryBuilderConfig = {};

  addFilter(key: string, value: any): this {
    if (!this.config.filters) {
      this.config.filters = {};
    }
    this.config.filters[key] = value;
    return this;
  }

  addFilters(filters: Record<string, any>): this {
    this.config.filters = { ...this.config.filters, ...filters };
    return this;
  }

  select(fields: Record<string, boolean>): this {
    this.config.select = fields;
    return this;
  }

  include(relations: Record<string, any>): this {
    this.config.include = relations;
    return this;
  }

  orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): this {
    if (!this.config.orderBy) {
      this.config.orderBy = {};
    }
    this.config.orderBy[field] = direction;
    return this;
  }

  pagination(limit: number, skip: number = 0): this {
    this.config.take = limit;
    this.config.skip = skip;
    return this;
  }

  cursor(cursorId: string): this {
    this.config.cursor = cursorId;
    return this;
  }

  build(): IQueryBuilderConfig {
    return this.config;
  }

  reset(): this {
    this.config = {};
    return this;
  }

  toQuery(): Record<string, any> {
    const query: Record<string, any> = {};

    if (this.config.filters) {
      query.where = this.config.filters;
    }

    if (this.config.select) {
      query.select = this.config.select;
    }

    if (this.config.include) {
      query.include = this.config.include;
    }

    if (this.config.orderBy) {
      query.orderBy = this.config.orderBy;
    }

    if (this.config.take) {
      query.take = this.config.take;
    }

    if (this.config.skip) {
      query.skip = this.config.skip;
    }

    if (this.config.cursor) {
      query.cursor = { id: this.config.cursor };
    }

    return query;
  }
}
