import { Body, Controller, Post } from '@nestjs/common';
import { ProductsAnalyticsService } from './products-analytics.service';

@Controller('fashion/products-analytics')
export class ProductsAnalyticsController {
  constructor(private readonly productsAnalyticsService: ProductsAnalyticsService) {}

  @Post('update-engagement-metrics')
  updateEngagementMetrics(
    @Body() body
  ) {
    console.log('Incoming request body:', JSON.stringify(body, null, 2))
    return this.productsAnalyticsService.updateEngagementMetrics(body)
  }
}
