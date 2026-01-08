import { Module } from '@nestjs/common';
import { ProductsAnalyticsService } from './products-analytics.service';
import { ProductsAnalyticsController } from './products-analytics.controller';

@Module({
  controllers: [ProductsAnalyticsController],
  providers: [ProductsAnalyticsService],
})
export class ProductsAnalyticsModule {}
