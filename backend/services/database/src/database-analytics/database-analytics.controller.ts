import { Controller } from '@nestjs/common';
import { DatabaseAnalyticsService } from './database-analytics.service';
import { MessagePattern } from '@nestjs/microservices';


@Controller('database-analytics')
export class DatabaseAnalyticsController {
  constructor(
    private readonly databaseAnalyticsService: DatabaseAnalyticsService,
    private analyticsService: DatabaseAnalyticsService,
  ) {}

  @MessagePattern('update-rating-metrics')
  async updateRatingMetrics(params){
    return this.analyticsService.updateRatingMetrics(params)
  }

  @MessagePattern('update-engagement-metrics')
  async updateEngagementMetrics(params){
    return this.analyticsService.updateRatingMetrics(params)
  }

  @MessagePattern('create-metrics-record')
  async createAnalytics(params){
    return this.analyticsService.createMetricsRecord(params)
  }
}
