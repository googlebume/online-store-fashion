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
          orders: data.metrics?.orders || 0,
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

  @MessagePattern('create-analytics-event')
  async createAnalyticsEvent(
    @Payload()
    data: {
      name: string;
      sessionId?: string;
      userId?: string;
      productId?: string;
      path?: string;
      durationMs?: number;
      payload?: unknown;
      clientId?: string;
    },
  ) {
    try {
      if (!data?.name || typeof data.name !== 'string') {
        return { success: false, message: 'Event name is required' };
      }
      const record = await this.prisma.analyticsEvent.create({
        data: {
          name: data.name,
          sessionId: data.sessionId,
          userId: data.userId,
          productId: data.productId,
          path: data.path,
          durationMs: data.durationMs,
          payload: data.payload === undefined ? undefined : (data.payload as object),
          clientId: data.clientId,
        },
      });
      return { success: true, data: record };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @MessagePattern('get-analytics-dashboard')
  async getAnalyticsDashboard() {
    try {
      const now = new Date();
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const [
        totalEvents,
        eventsLast24h,
        eventsByName,
        recentEvents,
        sessionGroups,
        weekSample,
        topProductsByViews,
      ] = await Promise.all([
        this.prisma.analyticsEvent.count(),
        this.prisma.analyticsEvent.count({
          where: { createdAt: { gte: dayAgo } },
        }),
        this.prisma.analyticsEvent.groupBy({
          by: ['name'],
          _count: { name: true },
          orderBy: { _count: { name: 'desc' } },
          take: 16,
        }),
        this.prisma.analyticsEvent.findMany({
          orderBy: { createdAt: 'desc' },
          take: 35,
          select: {
            id: true,
            name: true,
            path: true,
            sessionId: true,
            userId: true,
            productId: true,
            durationMs: true,
            payload: true,
            createdAt: true,
          },
        }),
        this.prisma.analyticsEvent.groupBy({
          by: ['sessionId'],
          where: { sessionId: { not: null } },
          _count: { sessionId: true },
        }),
        this.prisma.analyticsEvent.findMany({
          where: { createdAt: { gte: weekAgo } },
          select: { createdAt: true },
        }),
        this.prisma.producsAnalytics.findMany({
          orderBy: { views: 'desc' },
          take: 6,
          include: {
            product: { select: { id: true, name: true, image: true } },
          },
        }),
      ]);

      const uniqueSessions = sessionGroups.length;

      const dayBuckets: Record<string, number> = {};
      for (const row of weekSample) {
        const key = row.createdAt.toISOString().slice(0, 10);
        dayBuckets[key] = (dayBuckets[key] || 0) + 1;
      }
      const last7Days: { date: string; count: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        last7Days.push({ date: key, count: dayBuckets[key] || 0 });
      }

      return {
        success: true,
        data: {
          totals: {
            allTime: totalEvents,
            last24h: eventsLast24h,
            uniqueSessions,
          },
          eventsByName: eventsByName.map((r) => ({
            name: r.name,
            count: r._count.name,
          })),
          last7Days,
          recentEvents,
          topProductsByViews: topProductsByViews.map((row) => ({
            productId: row.productId,
            views: row.views,
            clicks: row.clicks,
            orders: row.orders,
            productName: row.product?.name ?? null,
            image: row.product?.image ?? null,
          })),
        },
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  /** Агрегація подій promo_order_completed: скільки замовлень та унікальних userId на промокод. */
  @MessagePattern('get-promo-redemption-stats')
  async getPromoRedemptionStats() {
    try {
      const events = await this.prisma.analyticsEvent.findMany({
        where: { name: 'promo_order_completed' },
        select: { userId: true, payload: true },
      });

      const byCode = new Map<string, { userIds: Set<string>; orders: number }>();

      for (const ev of events) {
        const raw = ev.payload as Record<string, unknown> | null | undefined;
        const codeRaw = raw?.promo_code ?? raw?.promoCode;
        const code = typeof codeRaw === 'string' ? codeRaw.trim().toUpperCase() : '';
        if (!code) continue;

        if (!byCode.has(code)) {
          byCode.set(code, { userIds: new Set(), orders: 0 });
        }
        const bucket = byCode.get(code)!;
        bucket.orders += 1;
        if (ev.userId) {
          bucket.userIds.add(ev.userId);
        }
      }

      const rows = [...byCode.entries()]
        .map(([promoCode, v]) => ({
          promoCode,
          orders: v.orders,
          distinctUsers: v.userIds.size,
        }))
        .sort((a, b) => b.orders - a.orders);

      return { success: true, data: rows };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }
}
