import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

export const databaseClient: ClientProxy = ClientProxyFactory.create({
  transport: Transport.TCP,
  options: { host: 'localhost', port: 5001 },
});