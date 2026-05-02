import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  DATABASE_SERVICE,
  ORDER_SERVICE,
  databaseTcpHost,
  databaseTcpPort,
  orderServiceTcpHost,
  orderServiceTcpPort,
} from './tcp.tokens';
import { TcpLifecycleService } from './tcp-lifecycle.service';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: DATABASE_SERVICE,
        transport: Transport.TCP,
        options: {
          host: databaseTcpHost(),
          port: databaseTcpPort(),
        },
      },
      {
        name: ORDER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: orderServiceTcpHost(),
          port: orderServiceTcpPort(),
        },
      },
    ]),
  ],
  providers: [TcpLifecycleService],
  exports: [ClientsModule],
})
export class TcpClientsModule {}
