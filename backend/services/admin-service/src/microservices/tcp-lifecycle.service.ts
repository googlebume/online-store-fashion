import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  DATABASE_SERVICE,
  ORDER_SERVICE,
  databaseTcpHost,
  databaseTcpPort,
  orderServiceTcpHost,
  orderServiceTcpPort,
} from './tcp.tokens';

@Injectable()
export class TcpLifecycleService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TcpLifecycleService.name);

  constructor(
    @Inject(DATABASE_SERVICE) private readonly databaseClient: ClientProxy,
    @Inject(ORDER_SERVICE) private readonly orderClient: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.safeConnect(
      this.databaseClient,
      `database TCP ${databaseTcpHost()}:${databaseTcpPort()}`,
    );
    await this.safeConnect(this.orderClient, `order TCP ${orderServiceTcpHost()}:${orderServiceTcpPort()}`);
  }

  async onModuleDestroy() {
    await this.safeClose(this.databaseClient);
    await this.safeClose(this.orderClient);
  }

  private async safeConnect(client: ClientProxy, label: string) {
    try {
      await client.connect();
      this.logger.log(`Підключено до ${label}`);
    } catch (e: any) {
      this.logger.warn(`${label} недоступний при старті: ${e?.message ?? e}. Повтор при першому запиті.`);
    }
  }

  private async safeClose(client: ClientProxy) {
    try {
      await client.close();
    } catch {
      /* ignore */
    }
  }
}
