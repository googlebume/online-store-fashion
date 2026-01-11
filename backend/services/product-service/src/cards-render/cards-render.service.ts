import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { IDatabaseClient, IDatabaseResponse, IPaginatedResponse } from '../interfaces/database-client.interface';
import { IProduct, IGetProductsParams } from '../dto/product.dto';

/**
 * Cards Render Service
 * SOLID Principle: Single Responsibility
 * Handles business logic for rendering product cards
 */
@Injectable()
export class CardsRenderService {
  constructor(
    @Inject('IDatabaseClient')
    private readonly databaseClient: IDatabaseClient,
  ) {}

  /**
   * Get all products
   * @returns Array of products
   */
  async getProducts(): Promise<IProduct[]> {
    try {
      const response = await lastValueFrom<IDatabaseResponse<IProduct[]>>(
        this.databaseClient.send('get_products', {}),
      );

      if (!response.success) {
        throw new HttpException(
          response.message || 'Failed to fetch products',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (!Array.isArray(response.data)) {
        console.error('Помилка: response.data не є масивом', response);
        return [];
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new HttpException(
        error.message || 'Failed to fetch products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Dynamically load products with pagination
   * @param params Pagination parameters
   * @returns Paginated products response
   */
  async dynamicallyLoad(params: IGetProductsParams): Promise<IPaginatedResponse<IProduct>> {
    try {
      // Convert 0-based page to 1-based for database service
      // Frontend sends page: 0, but database expects page >= 1
      const dbParams = {
        take: params.take,
        page: params.page + 1, // Convert 0-based to 1-based
        cursor: params.cursor,
      };

      console.log('Requesting products with params:', { original: params, dbParams });
      
      const response = await lastValueFrom<IPaginatedResponse<IProduct>>(
        this.databaseClient.send('get_products_dynamically', dbParams),
      );

      console.log('Received response:', JSON.stringify(response, null, 2));

      if (!response || typeof response !== 'object') {
        throw new HttpException(
          'Invalid response from database service',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (!response.success) {
        throw new HttpException(
          response.message || 'Failed to load products',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Ensure response has the expected structure
      // Convert back to 0-based page for frontend
      const result: IPaginatedResponse<IProduct> = {
        success: true,
        data: response.data || [],
        meta: response.meta ? {
          ...response.meta,
          page: response.meta.page - 1, // Convert back to 0-based
        } : {
          page: params.page,
          limit: params.take,
          hasMore: false,
        },
      };

      return result;
    } catch (error) {
      console.error('Error loading products dynamically:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }

      // Handle RxJS timeout or connection errors
      if (error.code === 'ECONNREFUSED' || error.message?.includes('timeout')) {
        throw new HttpException(
          'Database service is unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      throw new HttpException(
        error.message || 'Failed to load products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}