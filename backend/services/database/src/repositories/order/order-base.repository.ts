import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../core/base-repository.abstract';
import { PrismaService } from '../../prisma.service';
import { Order, DeliveryMethod } from '@prisma/client';
import { ICreateInput, IUpdateInput, IQueryOptions } from '../core/types';
import { ErrorHandler } from '../core/error-handler';

export interface IOrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface ICreateOrderInput extends ICreateInput<Order> {
  userId?: string;
  items: IOrderItem[];
  total: number;
  deliveryMethod: DeliveryMethod | string;
  address: string;
  email: string;
  status?: string;
}

export interface IUpdateOrderInput extends IUpdateInput<Order> {
  status?: string;
  address?: string;
  email?: string;
  total?: number;
}

/**
 * Order Repository - SOLID Principle: Single Responsibility
 * Only responsible for order data persistence operations
 */
@Injectable()
export class OrderBaseHandler extends BaseRepository<Order> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected getModel(): any {
    return this.prisma.order;
  }

  /**
   * Find order by ID with items
   */
  async findByIdWithItems(id: string): Promise<Order | null> {
    try {
      return await this.findById(id, {
        include: {
          items: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      ErrorHandler.handleError(error, 'Order');
    }
  }

  /**
   * Find user orders
   */
  async findByUserId(userId: string, options?: IQueryOptions): Promise<Order[]> {
    try {
      return await this.find(
        { userId },
        {
          ...options,
          include: {
            items: true,
          },
        }
      );
    } catch (error) {
      ErrorHandler.handleError(error, 'Order');
    }
  }

  /**
   * Find all orders with items
   */
  async findAllWithItems(options?: IQueryOptions): Promise<Order[]> {
    try {
      return await this.findAll({
        ...options,
        include: {
          items: true,
          user: true,
        },
      });
    } catch (error) {
      ErrorHandler.handleError(error, 'Order');
    }
  }

  /**
   * Create order with items
   */
  override async create(data: ICreateOrderInput): Promise<Order> {
    try {
      const deliveryMethodMap: Record<string, DeliveryMethod> = {
        "Кур'єр": DeliveryMethod.Courier,
        'Самовивіз': DeliveryMethod.Pickup,
        'Courier': DeliveryMethod.Courier,
        'Pickup': DeliveryMethod.Pickup,
      };

      const mappedDeliveryMethod =
        typeof data.deliveryMethod === 'string'
          ? deliveryMethodMap[data.deliveryMethod] || (data.deliveryMethod as DeliveryMethod)
          : data.deliveryMethod;

      const { items, ...orderData } = data;

      return await this.prisma.order.create({
        data: {
          ...orderData,
          deliveryMethod: mappedDeliveryMethod,
          status: data.status || 'pending',
          items: {
            create: items,
          },
        },
        include: {
          items: true,
        },
      });
    } catch (error) {
      ErrorHandler.handleError(error, 'Order');
    }
  }

  /**
   * Update order
   */
  override async updateById(
    id: string | number,
    data: IUpdateOrderInput
  ): Promise<Order> {
    try {
      return await this.prisma.order.update({
        where: { id: id as string },
        data,
        include: {
          items: true,
        },
      });
    } catch (error) {
      ErrorHandler.handleError(error, 'Order');
    }
  }

  /**
   * Update order status
   */
  async updateStatus(orderId: string, status: string): Promise<Order> {
    try {
      return this.updateById(orderId, { status });
    } catch (error) {
      ErrorHandler.handleError(error, 'Order');
    }
  }

  /**
   * Find orders by status
   */
  async findByStatus(status: string, options?: IQueryOptions): Promise<Order[]> {
    try {
      return await this.find(
        { status },
        {
          ...options,
          include: {
            items: true,
          },
        }
      );
    } catch (error) {
      ErrorHandler.handleError(error, 'Order');
    }
  }

  /**
   * Delete order with items
   */
  override async deleteById(id: string | number): Promise<void> {
    try {
      // Delete order items first
      await this.prisma.orderItem.deleteMany({
        where: { orderId: id as string },
      });

      // Delete order
      await this.prisma.order.delete({
        where: { id: id as string },
      });
    } catch (error) {
      ErrorHandler.handleError(error, 'Order');
    }
  }

  /**
   * Get order statistics
   */
  async getStatistics(filters?: {
    startDate?: Date;
    endDate?: Date;
    status?: string;
  }): Promise<{
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  }> {
    try {
      const where: Record<string, any> = {};

      if (filters?.startDate || filters?.endDate) {
        where.createdAt = {};
        if (filters.startDate) where.createdAt.gte = filters.startDate;
        if (filters.endDate) where.createdAt.lte = filters.endDate;
      }

      if (filters?.status) {
        where.status = filters.status;
      }

      const orders = await this.find(where);

      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      return {
        totalOrders,
        totalRevenue,
        averageOrderValue,
      };
    } catch (error) {
      ErrorHandler.handleError(error, 'Order');
    }
  }
}