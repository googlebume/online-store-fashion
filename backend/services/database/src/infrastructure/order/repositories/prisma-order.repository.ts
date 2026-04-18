import { Injectable } from '@nestjs/common';
import { Result, ok, fail } from '../../../shared/result';
import { OrderEntity } from '../../../domain/order/entities/order.entity';
import { OrderStatus } from '../../../domain/order/value-objects/order-status.vo';
import {
  IOrderRepository,
  OrderStatistics,
} from '../../../domain/order/ports/order-repository.port';
import { OrderNotFoundError } from '../../../domain/order/exceptions/order.exceptions';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { OrderMapper } from '../mappers/order.mapper';

@Injectable()
export class PrismaOrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Result<OrderEntity, Error>> {
    try {
      const order = await this.prisma.order.findUnique({ where: { id } });
      if (!order) return fail(new OrderNotFoundError(id));
      return ok(OrderMapper.toDomain(order));
    } catch (error) {
      return fail(new Error(`Failed to find order by id: ${error}`));
    }
  }

  async findByIdWithItems(id: string): Promise<Result<OrderEntity, Error>> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: { items: true, user: true },
      });
      if (!order) return fail(new OrderNotFoundError(id));
      return ok(OrderMapper.toDomain(order));
    } catch (error) {
      return fail(new Error(`Failed to find order with items: ${error}`));
    }
  }

  async findByUserId(userId: string): Promise<Result<OrderEntity[], Error>> {
    try {
      const orders = await this.prisma.order.findMany({
        where: { userId },
        include: { items: true },
      });
      return ok(orders.map(o => OrderMapper.toDomain(o)));
    } catch (error) {
      return fail(new Error(`Failed to find orders by user: ${error}`));
    }
  }

  async findByStatus(status: OrderStatus): Promise<Result<OrderEntity[], Error>> {
    try {
      const orders = await this.prisma.order.findMany({
        where: { status: status.toString() },
        include: { items: true },
      });
      return ok(orders.map(o => OrderMapper.toDomain(o)));
    } catch (error) {
      return fail(new Error(`Failed to find orders by status: ${error}`));
    }
  }

  async findAll(): Promise<Result<OrderEntity[], Error>> {
    try {
      const orders = await this.prisma.order.findMany();
      return ok(orders.map(o => OrderMapper.toDomain(o)));
    } catch (error) {
      return fail(new Error(`Failed to find all orders: ${error}`));
    }
  }

  async findAllWithItems(): Promise<Result<OrderEntity[], Error>> {
    try {
      const orders = await this.prisma.order.findMany({
        include: { items: true, user: true },
      });
      return ok(orders.map(o => OrderMapper.toDomain(o)));
    } catch (error) {
      return fail(new Error(`Failed to find all orders with items: ${error}`));
    }
  }

  async save(order: OrderEntity): Promise<Result<OrderEntity, Error>> {
    try {
      const data = OrderMapper.toPersistence(order);
      const itemsData = order.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price.amount,
      }));

      const created = await this.prisma.order.create({
        data: {
          ...data,
          items: { create: itemsData },
        },
        include: { items: true },
      });

      return ok(OrderMapper.toDomain(created));
    } catch (error) {
      return fail(new Error(`Failed to save order: ${error}`));
    }
  }

  async update(id: string, partial: any): Promise<Result<OrderEntity, Error>> {
    try {
      const order = await this.prisma.order.findUnique({ where: { id } });
      if (!order) return fail(new OrderNotFoundError(id));

      const updated = await this.prisma.order.update({
        where: { id },
        data: partial,
        include: { items: true },
      });

      return ok(OrderMapper.toDomain(updated));
    } catch (error) {
      return fail(new Error(`Failed to update order: ${error}`));
    }
  }

  async delete(id: string): Promise<Result<void, Error>> {
    try {
      const order = await this.prisma.order.findUnique({ where: { id } });
      if (!order) return fail(new OrderNotFoundError(id));

      await this.prisma.orderItem.deleteMany({ where: { orderId: id } });
      await this.prisma.order.delete({ where: { id } });

      return ok(undefined);
    } catch (error) {
      return fail(new Error(`Failed to delete order: ${error}`));
    }
  }

  async getStatistics(filters?: Record<string, any>): Promise<Result<OrderStatistics, Error>> {
    try {
      const orders = await this.prisma.order.findMany({
        ...(filters && { where: filters }),
      });

      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      return ok({
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
      });
    } catch (error) {
      return fail(new Error(`Failed to get order statistics: ${error}`));
    }
  }
}
