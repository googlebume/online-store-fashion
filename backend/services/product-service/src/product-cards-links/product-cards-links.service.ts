import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { IDatabaseClient, IDatabaseResponse } from '../interfaces/database-client.interface';
import { IProduct, IGetProductByNameParams } from '../dto/product.dto';

/**
 * Product Cards Links Service
 * SOLID Principle: Single Responsibility
 * Handles business logic for product links and random product selection
 */
@Injectable()
export class ProductCardsLinksService {
  constructor(
    @Inject('IDatabaseClient')
    private readonly databaseClient: IDatabaseClient,
  ) {}

  /**
   * Get product by name
   * @param name Product name
   * @returns Product or null
   */
  async getProductByName(name: string): Promise<IProduct | null> {
    try {
      const response = await lastValueFrom<IDatabaseResponse<IProduct>>(
        this.databaseClient.send('get_product_by_name', { name }),
      );

      if (!response.success) {
        throw new HttpException(
          response.message || 'Failed to get product',
          HttpStatus.NOT_FOUND,
        );
      }

      return response.data || null;
    } catch (error) {
      console.error('Microservice error:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to get product from database: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get random products
   * @param count Number of products to return
   * @returns Array of random products
   */
  async getRandomProducts(count: number): Promise<IProduct[]> {
    try {
      const response = await lastValueFrom<IDatabaseResponse<IProduct[]>>(
        this.databaseClient.send('get_products', {}),
      );

      if (!response.success || !response.data) {
        console.warn('No products found in database');
        return [];
      }

      if (!Array.isArray(response.data) || response.data.length === 0) {
        console.warn('No products found in database');
        return [];
      }

      const shuffled = this.shuffleArray([...response.data]);
      const selectedProducts = shuffled.slice(0, Math.min(count, shuffled.length));

      return selectedProducts;
    } catch (error) {
      console.error('Error fetching random products:', error);
      return [];
    }
  }

  /**
   * Get random products by known IDs
   * @param count Number of products to return
   * @returns Array of products
   */
  async getRandomProductsByIds(count: number): Promise<IProduct[]> {
    const knownUUIDs = ['90123456-7890-1234-2345-901234000890'];

    const randomUUIDs = this.getRandomElements(knownUUIDs, count);
    const products: IProduct[] = [];

    for (const id of randomUUIDs) {
      try {
        const response = await lastValueFrom<IDatabaseResponse<IProduct>>(
          this.databaseClient.send('get_product_by_id', { id }),
        );

        if (response.success && response.data) {
          products.push(response.data);
        }
      } catch (error) {
        console.error(`Error fetching product with ID ${id}:`, error);
      }
    }

    return products;
  }

  /**
   * Get all product IDs
   * @returns Array of product IDs
   */
  async getProductIds(): Promise<string[]> {
    try {
      const response = await lastValueFrom<IDatabaseResponse<IProduct[]>>(
        this.databaseClient.send('get_products', {}),
      );

      if (!response.success || !response.data || !Array.isArray(response.data)) {
        return [];
      }

      return response.data.map((product: IProduct) => product.id).filter(Boolean);
    } catch (error) {
      console.error('Error fetching product IDs:', error);
      return [];
    }
  }

  /**
   * Get random products optimized (fetches IDs first, then products)
   * @param count Number of products to return
   * @returns Array of products
   */
  async getRandomProductsOptimized(count: number): Promise<IProduct[]> {
    try {
      const productIds = await this.getProductIds();

      if (productIds.length === 0) {
        return [];
      }

      const randomIds = this.getRandomElements(productIds, count);
      const products: IProduct[] = [];

      for (const id of randomIds) {
        try {
          const response = await lastValueFrom<IDatabaseResponse<IProduct>>(
            this.databaseClient.send('get_product_by_id', { id }),
          );

          if (response.success && response.data) {
            products.push(response.data);
          }
        } catch (error) {
          console.error(`Error fetching product with ID ${id}:`, error);
        }
      }

      return products;
    } catch (error) {
      console.error('Error in getRandomProductsOptimized:', error);
      return [];
    }
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   * @param array Array to shuffle
   * @returns Shuffled array
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Get random elements from array
   * @param array Source array
   * @param count Number of elements to return
   * @returns Array of random elements
   */
  private getRandomElements<T>(array: T[], count: number): T[] {
    if (array.length <= count) {
      return [...array];
    }

    const shuffled = this.shuffleArray(array);
    return shuffled.slice(0, count);
  }
}