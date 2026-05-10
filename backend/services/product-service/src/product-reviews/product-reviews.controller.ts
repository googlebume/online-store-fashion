import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProductReviewsService } from './product-reviews.service';
import { Throttle } from '@nestjs/throttler';
import {
  reviewListSchema,
  reviewSchema,
  reviewStatsSchema,
} from '@packages/shared/common/swagger/response-schemas';

@ApiTags('Product Reviews')
@Controller('fashion/shop/product')
export class ProductReviewsController {
  constructor(private readonly productReviewsService: ProductReviewsService) {}

  @Throttle({ default: { ttl: 60000, limit: 120 } })
  @Get(':productName/reviews/stats')
  @ApiOperation({ summary: 'Get aggregated review statistics for a product' })
  @ApiParam({ name: 'productName', example: 'hoodie_1' })
  @ApiOkResponse({ description: 'Review statistics', schema: reviewStatsSchema })
  async getReviewStats(@Param('productName') productName: string) {
    try {
      return await this.productReviewsService.statsByProductName(productName);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error.message || 'Could not load review stats',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Throttle({ default: { ttl: 60000, limit: 120 } })
  @Get(':productName/reviews')
  @ApiOperation({ summary: 'List product reviews with pagination' })
  @ApiParam({ name: 'productName', example: 'hoodie_1' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiOkResponse({ description: 'Paginated reviews', schema: reviewListSchema })
  async listReviews(
    @Param('productName') productName: string,
    @Query('page') pageRaw?: string,
    @Query('limit') limitRaw?: string,
  ) {
    try {
      const page = Math.max(1, parseInt(pageRaw ?? '1', 10) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(limitRaw ?? '10', 10) || 10));

      return await this.productReviewsService.listByProductName(productName, page, limit);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error.message || 'Could not load reviews',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Throttle({ default: { ttl: 60000, limit: 30 } })
  @Post(':productName/reviews')
  @ApiOperation({ summary: 'Create a review for a product' })
  @ApiParam({ name: 'productName', example: 'hoodie_1' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['userId', 'reviewTitle', 'text', 'stars'],
      properties: {
        userId: { type: 'string', example: 'fa2ab114-bf38-43d0-b0dc-4fe6cd34f001' },
        reviewTitle: { type: 'string', example: 'Very comfortable hoodie' },
        text: { type: 'string', example: 'Fabric feels premium and the size matches expectations.' },
        stars: { type: 'number', example: 5, minimum: 1, maximum: 5 },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Created review', schema: reviewSchema })
  async createReview(
    @Param('productName') productName: string,
    @Body()
    body: {
      userId: string;
      reviewTitle: string;
      text: string;
      stars: number;
    },
  ) {
    try {
      if (!body?.userId?.trim()) {
        throw new HttpException('userId обов’язковий', HttpStatus.BAD_REQUEST);
      }
      return await this.productReviewsService.createForProductName(productName, body);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error.message || 'Could not create review',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
