import { Provider } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { IDatabaseClient } from './database-client.interface';
import { Observable } from 'rxjs';

/**
 * Database Client Implementation
 * SOLID Principle: Dependency Inversion
 * Concrete implementation of IDatabaseClient interface
 */
class DatabaseClientImpl implements IDatabaseClient {
  private readonly client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'localhost', port: 5001 },
    });
  }

  send<T = any>(pattern: string, data: any): Observable<T> {
    return this.client.send<T>(pattern, data);
  }
}

/**
 * Database Client Provider
 * Provides IDatabaseClient implementation for dependency injection
 */
export const DatabaseClientProvider: Provider<IDatabaseClient> = {
  provide: 'IDatabaseClient',
  useFactory: (): IDatabaseClient => {
    return new DatabaseClientImpl();
  },
};
