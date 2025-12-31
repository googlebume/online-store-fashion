import { Module } from '@nestjs/common';
import { DatabaseAnalyticsService } from './database-analytics.service';
import { DatabaseAnalyticsController } from './database-analytics.controller';
import BaseProductsAnalyticsHandler from 'src/repositories/products-analytics/baseProductsAnalytics.handler';

@Module({
  controllers: [DatabaseAnalyticsController],
  providers: [DatabaseAnalyticsService, BaseProductsAnalyticsHandler],
})
export class DatabaseAnalyticsModule {}
