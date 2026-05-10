import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductsAnalyticsService } from './products-analytics.service';

@ApiTags('Product Analytics')
@Controller('fashion/products-analytics')
export class ProductsAnalyticsController {
  constructor(private readonly productsAnalyticsService: ProductsAnalyticsService) {}

  @Post('update-engagement-metrics')
  @ApiOperation({ summary: 'Increment product engagement metrics' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['productId', 'metrics'],
      properties: {
        productId: { type: 'string', example: '9f5051b7-5f5d-4f6e-9f35-2f3d9aa4f001' },
        metrics: {
          type: 'object',
          properties: {
            views: { type: 'number', example: 1 },
            clicks: { type: 'number', example: 1 },
            purchases: { type: 'number', example: 0 },
          },
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Updated or created analytics record',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          additionalProperties: true,
          example: { productId: '9f5051b7-5f5d-4f6e-9f35-2f3d9aa4f001', views: 10, clicks: 3, purchases: 1 },
        },
      },
    },
  })
  updateEngagementMetrics(
    @Body() body
  ) {
    console.log('Incoming request body:', JSON.stringify(body, null, 2))
    return this.productsAnalyticsService.updateEngagementMetrics(body)
  }
}
