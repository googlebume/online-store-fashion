import { Module } from '@nestjs/common';
import { ProductsAnalyticsModule } from './products-analytics/products-analytics.module';
import { EventsModule } from './events/events.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [ProductsAnalyticsModule, EventsModule, DashboardModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
