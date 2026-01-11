import { Observable } from 'rxjs';

/**
 * Database Client Interface
 * SOLID Principle: Dependency Inversion
 * Services depend on abstraction, not concrete implementation
 */
export interface IDatabaseClient {
  /**
   * Send message to database microservice
   * @param pattern Message pattern (e.g., 'get_products')
   * @param data Payload data
   * @returns Observable with response
   */
  send<T = any>(pattern: string, data: any): Observable<T>;
}

/**
 * Response structure from database service
 */
export interface IDatabaseResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Paginated response structure
 * Matches the structure returned by DatabaseProductsService.getPaginatedProducts
 */
export interface IPaginatedResponse<T = any> {
  success: boolean;
  data?: T[];
  meta?: {
    total?: number;
    page: number;
    limit: number;
    cursor?: string;
    hasMore?: boolean;
  };
  message?: string;
}
