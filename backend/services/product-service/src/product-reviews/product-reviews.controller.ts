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
import { ProductReviewsService } from './product-reviews.service';
import { Throttle } from '@nestjs/throttler';

@Controller('fashion/shop/product')
export class ProductReviewsController {
  constructor(private readonly productReviewsService: ProductReviewsService) {}

  @Throttle({ default: { ttl: 60000, limit: 120 } })
  @Get(':productName/reviews/stats')
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
