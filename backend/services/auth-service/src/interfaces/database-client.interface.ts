import { Observable } from 'rxjs';

/**
 * Database Client Interface
 * SOLID Principle: Dependency Inversion
 * Services depend on abstraction, not concrete implementation
 */
export interface IDatabaseClient {
  /**
   * Send message to database microservice
   * @param pattern Message pattern (e.g., 'login_user', 'add_new_user')
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
 * User response structure
 */
export interface IUserResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    [key: string]: any;
  };
}
