import { Module } from '@nestjs/common';
import { ProductsAnalyticsModule } from './products-analytics/products-analytics.module';

@Module({
  imports: [ProductsAnalyticsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
