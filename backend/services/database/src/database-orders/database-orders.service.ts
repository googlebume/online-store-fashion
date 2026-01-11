import { Injectable } from '@nestjs/common';
import { OrderBaseHandler, ICreateOrderInput } from '../repositories/order/order-base.repository';

/**
 * Database Orders Service
 * SOLID Principle: Single Responsibility
 * Handles order-related business logic and delegates data operations to OrderBaseHandler
 */
@Injectable()
export class DatabaseOrdersService {
  constructor(private readonly orderRepository: OrderBaseHandler) {}

  /**
   * Get order by ID with items
   */
  async findById(id: string) {
    try {
      const order = await this.orderRepository.findByIdWithItems(id);
      if (!order) {
        return {
          success: false,
          message: 'Order not found'
        };
      }
      return {
        success: true,
        data: order
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Create new order
   */
  async createOrder(data: ICreateOrderInput) {
    try {
      const order = await this.orderRepository.create(data);
      return {
        success: true,
        message: 'Order created successfully',
        orderId: order.id,
        data: order
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Get user orders
   */
  async getUserOrders(userId: string) {
    try {
      const orders = await this.orderRepository.findByUserId(userId);
      return {
        success: true,
        data: orders
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Get all orders with items
   */
  async getAllOrders() {
    try {
      const orders = await this.orderRepository.findAllWithItems();
      return {
        success: true,
        data: orders
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: string) {
    try {
      const order = await this.orderRepository.updateStatus(orderId, status);
      return {
        success: true,
        message: 'Order status updated successfully',
        data: order
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Get orders by status
   */
  async getOrdersByStatus(status: string) {
    try {
      const orders = await this.orderRepository.findByStatus(status);
      return {
        success: true,
        data: orders
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Delete order
   */
  async deleteOrder(orderId: string) {
    try {
      await this.orderRepository.deleteById(orderId);
      return {
        success: true,
        message: 'Order deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Get order statistics
   */
  async getStatistics(filters?: { startDate?: Date; endDate?: Date; status?: string }) {
    try {
      const stats = await this.orderRepository.getStatistics(filters);
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}
