import { Result } from '../../../shared/result';
import { OrderEntity } from '../entities/order.entity';
import { OrderStatus } from '../value-objects/order-status.vo';

export const ORDER_REPOSITORY_PORT = Symbol('IOrderRepository');

export interface IOrderRepository {
  findById(id: string): Promise<Result<OrderEntity>>;
  findByIdWithItems(id: string): Promise<Result<OrderEntity>>;
  findByUserId(userId: string): Promise<Result<OrderEntity[]>>;
  findByStatus(status: OrderStatus): Promise<Result<OrderEntity[]>>;
  findAll(): Promise<Result<OrderEntity[]>>;
  findAllWithItems(): Promise<Result<OrderEntity[]>>;
  save(order: OrderEntity): Promise<Result<OrderEntity>>;
  update(id: string, partial: Partial<Omit<Record<keyof OrderEntity['props'], unknown>, 'items'>>): Promise<Result<OrderEntity>>;
  delete(id: string): Promise<Result<void>>;
  getStatistics(filters?: Record<string, any>): Promise<Result<OrderStatistics>>;
}

export interface OrderStatistics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}
