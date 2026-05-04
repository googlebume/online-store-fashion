import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

export const databaseClient: ClientProxy = ClientProxyFactory.create({
  transport: Transport.TCP,
  options: {
    host: process.env.DATABASE_MICROSERVICE_HOST ?? 'localhost',
    port: Number(process.env.DATABASE_MICROSERVICE_PORT ?? 5001),
  },
});