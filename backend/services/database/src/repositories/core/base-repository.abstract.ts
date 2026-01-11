import { IQueryFilter, IQueryOptions, IPaginatedResult, EntityId, ICreateInput, IUpdateInput } from './types';
import { IBaseRepository } from './base-repository.interface';

/**
 * Abstract base class implementing IBaseRepository
 * SOLID Principle: Liskov Substitution - all subclasses must properly implement parent contract
 */
export abstract class BaseRepository<T> implements IBaseRepository<T> {
  protected abstract getModel(): any;

  async findById(id: EntityId, options?: IQueryOptions): Promise<T | null> {
    return this.getModel().findUnique({
      where: { id },
      ...this.buildQueryOptions(options),
    });
  }

  async find(filter: IQueryFilter, options?: IQueryOptions): Promise<T[]> {
    return this.getModel().findMany({
      where: filter,
      ...this.buildQueryOptions(options),
    });
  }

  async findAll(options?: IQueryOptions): Promise<T[]> {
    return this.getModel().findMany(this.buildQueryOptions(options));
  }

  async findOne(filter: IQueryFilter, options?: IQueryOptions): Promise<T | null> {
    return this.getModel().findFirst({
      where: filter,
      ...this.buildQueryOptions(options),
    });
  }

  async findPaginated(
    filter: IQueryFilter,
    options?: IQueryOptions
  ): Promise<IPaginatedResult<T>> {
    const { limit, page = 1, cursor } = options?.pagination || { limit: 10, page: 1 };

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.getModel().findMany({
        where: filter,
        ...this.buildQueryOptions(options),
        take: limit,
        skip,
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      }),
      this.count(filter),
    ]);

    const lastItem = data[data.length - 1];
    const nextCursor = lastItem ? (lastItem as any).id : null;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        hasMore: skip + limit < total,
        cursor: nextCursor,
      },
    };
  }

  async create(data: ICreateInput<T>): Promise<T> {
    return this.getModel().create({ data });
  }

  async createMany(data: ICreateInput<T>[]): Promise<T[]> {
    return this.getModel().createMany({ data });
  }

  async updateById(id: EntityId, data: IUpdateInput<T>): Promise<T> {
    return this.getModel().update({
      where: { id },
      data,
    });
  }

  async update(filter: IQueryFilter, data: IUpdateInput<T>): Promise<T[]> {
    // Note: Prisma doesn't support updateMany with a filter in the same way
    // You might need to use a transaction or fetch first
    const items = await this.find(filter);
    const promises = items.map((item: any) => 
      this.updateById(item.id, data)
    );
    return Promise.all(promises);
  }

  async deleteById(id: EntityId): Promise<void> {
    await this.getModel().delete({
      where: { id },
    });
  }

  async delete(filter: IQueryFilter): Promise<number> {
    const result = await this.getModel().deleteMany({
      where: filter,
    });
    return result.count;
  }

  async exists(filter: IQueryFilter): Promise<boolean> {
    const result = await this.getModel().findFirst({
      where: filter,
      select: { id: true },
    });
    return result !== null;
  }

  async count(filter?: IQueryFilter): Promise<number> {
    return this.getModel().count({
      ...(filter && { where: filter }),
    });
  }

  /**
   * Build Prisma query options from IQueryOptions
   * SOLID Principle: Single Responsibility - only handles query option transformation
   */
  protected buildQueryOptions(options?: IQueryOptions): Record<string, any> {
    const queryOptions: Record<string, any> = {};

    if (options?.select) {
      queryOptions.select = options.select;
    }

    if (options?.include) {
      queryOptions.include = options.include;
    }

    if (options?.orderBy) {
      queryOptions.orderBy = options.orderBy;
    }

    return queryOptions;
  }
}
