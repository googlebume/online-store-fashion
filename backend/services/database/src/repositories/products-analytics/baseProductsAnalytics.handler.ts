import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../core/base-repository.abstract';
import { PrismaService } from '../../prisma.service';
import { ProducsAnalytics } from '@prisma/client';
import { ICreateInput, IUpdateInput, IQueryOptions } from '../core/types';
import { ErrorHandler } from '../core/error-handler';

export interface IEngagementMetrics {
  views?: number;
  clicks?: number;
  orders?: number;
}

export interface IRatingMetrics {
  reviews?: number;
  maxRating?: number;
  minRating?: number;
}

export interface ICreateAnalyticsInput extends ICreateInput<ProducsAnalytics> {
  productId: string;
  views?: number;
  clicks?: number;
  orders?: number;
  reviews?: number;
  maxRating?: number;
  minRating?: number;
}

export interface IUpdateAnalyticsInput extends IUpdateInput<ProducsAnalytics> {
  views?: number;
  clicks?: number;
  orders?: number;
  reviews?: number;
  maxRating?: number;
  minRating?: number;
}

/**
 * Product Analytics Repository - SOLID Principle: Single Responsibility
 * Only responsible for analytics data persistence operations
 */
@Injectable()
export class ProductsAnalyticsRepository extends BaseRepository<ProducsAnalytics> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected getModel(): any {
    return this.prisma.producsAnalytics;
  }

  /**
   * Find analytics by product ID
   */
  async findByProductId(productId: string): Promise<ProducsAnalytics | null> {
    try {
      return await this.findOne({ productId });
    } catch (error) {
      ErrorHandler.handleError(error, 'ProductAnalytics');
    }
  }

  /**
   * Create analytics record for product
   */
  override async create(data: ICreateAnalyticsInput): Promise<ProducsAnalytics> {
    try {
      return await this.prisma.producsAnalytics.create({
        data: {
          productId: data.productId,
          views: data.views || 0,
          clicks: data.clicks || 0,
          orders: data.orders || 0,
          reviews: data.reviews || 0,
          maxRating: data.maxRating || 0,
          minRating: data.minRating || 0,
        },
      });
    } catch (error) {
      ErrorHandler.handleError(error, 'ProductAnalytics');
    }
  }

  /**
   * Update engagement metrics (views, clicks, orders)
   */
  async updateEngagementMetrics(
    productId: string,
    metrics: IEngagementMetrics
  ): Promise<ProducsAnalytics | null> {
    try {
      const record = await this.findByProductId(productId);

      if (!record) {
        return null;
      }

      const updateData: IUpdateAnalyticsInput = {};

      if (metrics.views !== undefined) {
        updateData.views = record.views + metrics.views;
      }

      if (metrics.clicks !== undefined) {
        updateData.clicks = record.clicks + metrics.clicks;
      }

      if (metrics.orders !== undefined) {
        updateData.orders = record.orders + metrics.orders;
      }

      if (Object.keys(updateData).length === 0) {
        return record;
      }

      return await this.updateById(record.id, updateData);
    } catch (error) {
      ErrorHandler.handleError(error, 'ProductAnalytics');
    }
  }

  /**
   * Update rating metrics (reviews, maxRating, minRating)
   */
  async updateRatingMetrics(
    productId: string,
    metrics: IRatingMetrics
  ): Promise<ProducsAnalytics | null> {
    try {
      const record = await this.findByProductId(productId);

      if (!record) {
        return null;
      }

      const updateData: IUpdateAnalyticsInput = {};

      if (metrics.reviews !== undefined) {
        updateData.reviews = metrics.reviews;
      }

      if (metrics.maxRating !== undefined) {
        updateData.maxRating = metrics.maxRating;
      }

      if (metrics.minRating !== undefined) {
        updateData.minRating = metrics.minRating;
      }

      if (Object.keys(updateData).length === 0) {
        return record;
      }

      return await this.updateById(record.id, updateData);
    } catch (error) {
      ErrorHandler.handleError(error, 'ProductAnalytics');
    }
  }

  /**
   * Increment single metric
   */
  async incrementMetric(
    productId: string,
    metric: 'views' | 'clicks' | 'orders',
    value: number = 1
  ): Promise<ProducsAnalytics | null> {
    try {
      return this.updateEngagementMetrics(productId, {
        [metric]: value,
      });
    } catch (error) {
      ErrorHandler.handleError(error, 'ProductAnalytics');
    }
  }

  /**
   * Get top products by metric
   */
  async getTopProductsByMetric(
    metric: 'views' | 'clicks' | 'orders',
    limit: number = 10
  ): Promise<ProducsAnalytics[]> {
    try {
      return await this.findAll({
        orderBy: {
          [metric]: 'desc',
        },
        pagination: {
          limit,
          page: 1,
        },
      });
    } catch (error) {
      ErrorHandler.handleError(error, 'ProductAnalytics');
    }
  }

  /**
   * Get analytics with product data
   */
  async findWithProduct(productId: string): Promise<ProducsAnalytics | null> {
    try {
      return await this.findOne(
        { productId },
        {
          include: {
            product: true,
          },
        }
      );
    } catch (error) {
      ErrorHandler.handleError(error, 'ProductAnalytics');
    }
  }

  /**
   * Delete analytics record
   */
  override async deleteById(id: string | number): Promise<void> {
    try {
      await this.prisma.producsAnalytics.delete({
        where: { id: id as string },
      });
    } catch (error) {
      ErrorHandler.handleError(error, 'ProductAnalytics');
    }
  }
}