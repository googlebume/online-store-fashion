import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ProductCardsLinksService } from '../product-cards-links/product-cards-links.service';
import {
  IProductReviewGateway,
  PRODUCT_REVIEW_GATEWAY,
  ReviewDto,
  ReviewStatsDto,
} from '../domain/reviews/product-review.gateway.port';

@Injectable()
export class ProductReviewsService {
  constructor(
    private readonly productCards: ProductCardsLinksService,
    @Inject(PRODUCT_REVIEW_GATEWAY)
    private readonly reviewsGateway: IProductReviewGateway,
  ) {}

  async listByProductName(name: string, page: number, limit: number) {
    const product = await this.productCards.getProductByName(decodeURIComponent(name));
    if (!product) {
      throw new HttpException('Товар не знайдено', HttpStatus.NOT_FOUND);
    }

    const result = await this.reviewsGateway.listReviews(product.id, page, limit);
    if (!result.success) {
      throw new HttpException(result.message || 'Не вдалося завантажити відгуки', HttpStatus.BAD_REQUEST);
    }

    return {
      data: result.data ?? [],
      meta: result.meta,
    };
  }

  async statsByProductName(name: string): Promise<ReviewStatsDto> {
    const product = await this.productCards.getProductByName(decodeURIComponent(name));
    if (!product) {
      throw new HttpException('Товар не знайдено', HttpStatus.NOT_FOUND);
    }

    const result = await this.reviewsGateway.getStats(product.id);
    if (!result.success || !result.data) {
      throw new HttpException(result.message || 'Не вдалося завантажити статистику', HttpStatus.BAD_REQUEST);
    }

    return result.data;
  }

  async createForProductName(
    name: string,
    body: { userId: string; reviewTitle: string; text: string; stars: number },
  ): Promise<ReviewDto> {
    const product = await this.productCards.getProductByName(decodeURIComponent(name));
    if (!product) {
      throw new HttpException('Товар не знайдено', HttpStatus.NOT_FOUND);
    }

    const result = await this.reviewsGateway.createReview({
      userId: body.userId,
      productId: product.id,
      reviewTitle: body.reviewTitle,
      text: body.text,
      stars: body.stars,
    });

    if (!result.success || !result.data) {
      throw new HttpException(result.message || 'Не вдалося створити відгук', HttpStatus.BAD_REQUEST);
    }

    return result.data;
  }
}
