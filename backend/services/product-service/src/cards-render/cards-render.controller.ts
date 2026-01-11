import { CardsRenderService } from './cards-render.service';
import { Controller, Post, Body, Get, HttpException, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { IGetProductsParams } from '../dto/product.dto';

/**
 * Cards Render Controller
 * SOLID Principle: Single Responsibility
 * Handles HTTP requests for product cards rendering
 */
@Controller('fashion')
export class CardsRenderController {
  constructor(private readonly cardsRenderService: CardsRenderService) {}

  @Throttle({ default: { ttl: 60000, limit: 100 } })
  @Get('shop')
  async getProducts() {
    try {
      return await this.cardsRenderService.getProducts();
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch products',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('shop-dynamically')
  async dynamicallyLoad(@Body() params: IGetProductsParams) {
    try {
      // Properly validate params (page can be 0, so we check for undefined/null)
      if (params.take === undefined || params.take === null || params.page === undefined || params.page === null) {
        throw new HttpException(
          'Parameters "take" and "page" are required',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (params.take <= 0) {
        throw new HttpException(
          'Parameter "take" must be greater than 0',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (params.page < 0) {
        throw new HttpException(
          'Parameter "page" must be greater than or equal to 0',
          HttpStatus.BAD_REQUEST,
        );
      }

      const response = await this.cardsRenderService.dynamicallyLoad(params);
      
      // Transform response to match frontend expectations: {meta, loaded}
      // Ensure meta exists with proper structure
      if (!response || !response.meta) {
        console.error('Invalid response structure:', response);
        throw new HttpException(
          'Invalid response structure from service',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        meta: response.meta,
        loaded: response.data || [],
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to load products',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
