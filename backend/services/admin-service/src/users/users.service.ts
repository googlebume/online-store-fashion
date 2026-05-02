import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { DATABASE_SERVICE } from '../microservices/tcp.tokens';
import { sendMicroserviceRpc } from '../microservices/tcp-rpc.util';

const DB_DOWN_HINT =
  'database-service недоступний (TCP 5001). Запустіть database-service (мікросервіс).';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@Inject(DATABASE_SERVICE) private readonly databaseClient: ClientProxy) {}

  async getAllUsers(): Promise<object[]> {
    const response = await sendMicroserviceRpc<{ data?: object[] }>(
      this.databaseClient,
      this.logger,
      'database',
      'get_all_users',
      {},
      DB_DOWN_HINT,
    );
    return response?.data ?? [];
  }

  async deleteUser(id: string): Promise<object> {
    return sendMicroserviceRpc<object>(
      this.databaseClient,
      this.logger,
      'database',
      'delete_user',
      { id },
      DB_DOWN_HINT,
    );
  }
}
