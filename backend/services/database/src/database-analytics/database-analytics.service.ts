import { Injectable } from '@nestjs/common';
import { ProductsAnalyticsRepository, IEngagementMetrics, IRatingMetrics } from '../repositories/products-analytics/baseProductsAnalytics.handler';

/**
 * Database Analytics Service
 * SOLID Principle: Single Responsibility
 * Handles analytics-related business logic and delegates data operations to ProductsAnalyticsRepository
 */
@Injectable()
export class DatabaseAnalyticsService {
  constructor(private readonly analyticsRepository: ProductsAnalyticsRepository) {}

  /**
   * Find analytics by product ID
   */
  async findById(productId: string) {
    try {
      const analytics = await this.analyticsRepository.findByProductId(productId);
      if (!analytics) {
        return {
          success: false,
          message: 'Analytics record not found'
        };
      }
      return {
        success: true,
        data: analytics
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Create metrics record for new product
   */
  async createMetricsRecord(params: { productId: string; metrics?: any }) {
    try {
      const analytics = await this.analyticsRepository.create({
        productId: params.productId,
        views: params.metrics?.views || 0,
        clicks: params.metrics?.clicks || 0,
        orders: params.metrics?.orders || 0
      });
      return {
        success: true,
        message: 'Analytics record created',
        data: analytics
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Update engagement metrics (views, clicks, orders)
   */
  async updateEngagementMetrics(params: { productId: string; metrics: IEngagementMetrics }) {
    try {
      const result = await this.analyticsRepository.updateEngagementMetrics(
        params.productId,
        params.metrics
      );
      if (!result) {
        return {
          success: false,
          message: 'Analytics record not found for this product'
        };
      }
      return {
        success: true,
        message: 'Engagement metrics updated',
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Update rating metrics (reviews, ratings)
   */
  async updateRatingMetrics(params: { productId: string; metrics: IRatingMetrics }) {
    try {
      const result = await this.analyticsRepository.updateRatingMetrics(
        params.productId,
        params.metrics
      );
      if (!result) {
        return {
          success: false,
          message: 'Analytics record not found for this product'
        };
      }
      return {
        success: true,
        message: 'Rating metrics updated',
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Increment specific metric
   */
  async incrementMetric(params: { productId: string; metric: 'views' | 'clicks' | 'orders'; value?: number }) {
    try {
      const result = await this.analyticsRepository.incrementMetric(
        params.productId,
        params.metric,
        params.value || 1
      );
      if (!result) {
        return {
          success: false,
          message: 'Analytics record not found'
        };
      }
      return {
        success: true,
        message: `Metric ${params.metric} incremented`,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Get top products by metric
   */
  async getTopProducts(params: { metric: 'views' | 'clicks' | 'orders'; limit?: number }) {
    try {
      const results = await this.analyticsRepository.getTopProductsByMetric(
        params.metric,
        params.limit || 10
      );
      return {
        success: true,
        data: results
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Get analytics with product data
   */
  async getAnalyticsWithProduct(productId: string) {
    try {
      const analytics = await this.analyticsRepository.findWithProduct(productId);
      if (!analytics) {
        return {
          success: false,
          message: 'Analytics not found'
        };
      }
      return {
        success: true,
        data: analytics
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}
