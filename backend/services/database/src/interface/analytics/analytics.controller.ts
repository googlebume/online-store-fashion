import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PrismaService } from '../../infrastructure/shared/prisma/prisma.service';

@Controller()
export class AnalyticsController {
  constructor(private readonly prisma: PrismaService) {}

  @MessagePattern('get_product_analytics_by_id')
  async getProductAnalyticsById(@Payload() data: { productId: string }) {
    try {
      const analytics = await this.prisma.producsAnalytics.findUnique({
        where: { productId: data.productId },
        include: { product: true },
      });
      if (!analytics) {
        return { success: false, message: 'Analytics not found' };
      }
      return { success: true, data: analytics };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @MessagePattern('create-metrics-record')
  async createMetricsRecord(@Payload() data: { productId: string; metrics?: any }) {
    try {
      const record = await this.prisma.producsAnalytics.create({
        data: {
          productId: data.productId,
          views: data.metrics?.views || 0,
          clicks: data.metrics?.clicks || 0,
          purchases: data.metrics?.purchases || 0,
          reviews: 0,
          maxRating: 0,
          minRating: 0,
        },
      });
      return { success: true, data: record };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @MessagePattern('update-rating-metrics')
  async updateRatingMetrics(@Payload() data: { productId: string; metrics: any }) {
    try {
      const record = await this.prisma.producsAnalytics.update({
        where: { productId: data.productId },
        data: {
          reviews: data.metrics.reviews,
          maxRating: data.metrics.maxRating,
          minRating: data.metrics.minRating,
        },
      });
      return { success: true, data: record };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @MessagePattern('update-engagement-metrics')
  async updateEngagementMetrics(@Payload() data: { productId: string; metrics: any }) {
    try {
      const existing = await this.prisma.producsAnalytics.findUnique({
        where: { productId: data.productId },
      });
      if (!existing) return { success: false, message: 'Record not found' };

      const record = await this.prisma.producsAnalytics.update({
        where: { productId: data.productId },
        data: {
          views: (existing.views || 0) + (data.metrics.views || 0),
          clicks: (existing.clicks || 0) + (data.metrics.clicks || 0),
          purchases: (existing.purchases || 0) + (data.metrics.purchases || 0),
        },
      });
      return { success: true, data: record };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @MessagePattern('increment-metric')
  async incrementMetric(@Payload() data: { productId: string; metric: string; value?: number }) {
    try {
      const existing = await this.prisma.producsAnalytics.findUnique({
        where: { productId: data.productId },
      });
      if (!existing) return { success: false, message: 'Record not found' };

      const updateData: any = {};
      const increment = data.value || 1;
      updateData[data.metric] = (existing[data.metric] || 0) + increment;

      const record = await this.prisma.producsAnalytics.update({
        where: { productId: data.productId },
        data: updateData,
      });
      return { success: true, data: record };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @MessagePattern('get-top-products')
  async getTopProducts(@Payload() data: { metric: string; limit?: number }) {
    try {
      const limit = data.limit || 10;
      const orderBy: any = {};
      orderBy[data.metric] = 'desc';

      const products = await this.prisma.producsAnalytics.findMany({
        orderBy,
        take: limit,
        include: { product: true },
      });
      return { success: true, data: products };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @MessagePattern('get-analytics-with-product')
  async getAnalyticsWithProduct(@Payload() data: { productId: string }) {
    try {
      const analytics = await this.prisma.producsAnalytics.findUnique({
        where: { productId: data.productId },
        include: { product: true },
      });
      if (!analytics) {
        return { success: false, message: 'Analytics not found' };
      }
      return { success: true, data: analytics };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
