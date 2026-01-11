import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ProductCardsLinksService } from './product-cards-links.service';
import { Throttle } from '@nestjs/throttler';

/**
 * Product Cards Links Controller
 * SOLID Principle: Single Responsibility
 * Handles HTTP requests for product links and recommendations
 */
@Controller('fashion/shop/product')
export class ProductCardsLinksController {
  constructor(private readonly productCardsLinksService: ProductCardsLinksService) {}

  @Throttle({ default: { ttl: 60000, limit: 100 } })
  @Get()
  async returnMightlikeProducts() {
    try {
      const mightlikeProducts = await this.productCardsLinksService.getRandomProducts(9);
      return mightlikeProducts;
    } catch (error) {
      console.error('Error fetching random products:', error);
      throw new HttpException(
        error.message || 'Could not fetch products',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Throttle({ default: { ttl: 60000, limit: 100 } })
  @Get(':name')
  async returnProductByPathParam(@Param('name') name: string) {
    try {
      if (!name || name.trim().length === 0) {
        throw new HttpException('Product name is required', HttpStatus.BAD_REQUEST);
      }

      const product = await this.productCardsLinksService.getProductByName(name);

      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Could not fetch product',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
