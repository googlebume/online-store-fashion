import { NestFactory } from '@nestjs/core';
import { OrderModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3005'],
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type, Authorization',
  })
  await app.listen(process.env.PORT ?? 4006);

  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrderModule,
    {
      transport: Transport.TCP,
      options: { host: 'localhost', port: 5006 },
    },
  );

  await microservice.listen();
}
bootstrap();
