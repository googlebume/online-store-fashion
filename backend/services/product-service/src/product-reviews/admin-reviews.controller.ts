import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProductReviewsService } from './product-reviews.service';

@ApiTags('Admin Reviews')
@Controller('fashion/admin/reviews')
export class AdminReviewsController {
  constructor(private readonly reviewsService: ProductReviewsService) {}

  @Get('by-user/:userId')
  @ApiOperation({ summary: 'Get reviews written by a specific user (admin view)' })
  @ApiParam({ name: 'userId', example: 'fa2ab114-bf38-43d0-b0dc-4fe6cd34f001' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiOkResponse({ description: 'User reviews with product info' })
  async getUserReviews(
    @Param('userId') userId: string,
    @Query('page') pageRaw?: string,
    @Query('limit') limitRaw?: string,
  ) {
    const page = Math.max(1, parseInt(pageRaw ?? '1', 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(limitRaw ?? '10', 10) || 10));
    return this.reviewsService.listByUserId(userId, page, limit);
  }

  @Delete(':reviewId')
  @ApiOperation({ summary: 'Delete a review by id (admin)' })
  @ApiParam({ name: 'reviewId', example: 'fa2ab114-bf38-43d0-b0dc-4fe6cd34f001' })
  @ApiNoContentResponse({ description: 'Review deleted' })
  async deleteReview(@Param('reviewId') reviewId: string) {
    return this.reviewsService.deleteReview(reviewId);
  }
}
