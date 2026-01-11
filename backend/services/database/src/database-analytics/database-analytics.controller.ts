import { Controller } from '@nestjs/common';
import { DatabaseAnalyticsService } from './database-analytics.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

/**
 * Database Analytics Controller
 * Microservice controller using MessagePattern for inter-service communication
 * All methods follow the repository pattern through DatabaseAnalyticsService
 */
@Controller('database-analytics')
export class DatabaseAnalyticsController {
  constructor(private readonly analyticsService: DatabaseAnalyticsService) {}

  /**
   * Find analytics by product ID - microservice message pattern
   */
  @MessagePattern('get_product_analytics_by_id')
  async findById(@Payload() data: { productId: string }) {
    return this.analyticsService.findById(data.productId);
  }

  /**
   * Create analytics record - microservice message pattern
   */
  @MessagePattern('create-metrics-record')
  async createMetricsRecord(@Payload() params: any) {
    return this.analyticsService.createMetricsRecord(params);
  }

  /**
   * Update rating metrics - microservice message pattern
   */
  @MessagePattern('update-rating-metrics')
  async updateRatingMetrics(@Payload() params: { productId: string; metrics: any }) {
    return this.analyticsService.updateRatingMetrics(params);
  }

  /**
   * Update engagement metrics - microservice message pattern
   */
  @MessagePattern('update-engagement-metrics')
  async updateEngagementMetrics(@Payload() params: { productId: string; metrics: any }) {
    return this.analyticsService.updateEngagementMetrics(params);
  }

  /**
   * Increment metric - microservice message pattern
   */
  @MessagePattern('increment-metric')
  async incrementMetric(@Payload() params: { productId: string; metric: 'views' | 'clicks' | 'orders'; value?: number }) {
    return this.analyticsService.incrementMetric(params);
  }

  /**
   * Get top products - microservice message pattern
   */
  @MessagePattern('get-top-products')
  async getTopProducts(@Payload() params: { metric: 'views' | 'clicks' | 'orders'; limit?: number }) {
    return this.analyticsService.getTopProducts(params);
  }

  /**
   * Get analytics with product - microservice message pattern
   */
  @MessagePattern('get-analytics-with-product')
  async getAnalyticsWithProduct(@Payload() data: { productId: string }) {
    return this.analyticsService.getAnalyticsWithProduct(data.productId);
  }
}
