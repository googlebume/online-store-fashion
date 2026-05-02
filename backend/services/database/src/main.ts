import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './interface/app.module';

/**
 * Один Nest-додаток: TCP microservice (5001) + HTTP (5002).
 * Два окремі NestFactory на одному модулі небажані для стабільного TCP.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: process.env.DATABASE_MICROSERVICE_HOST ?? '0.0.0.0',
      port: Number(process.env.DATABASE_MICROSERVICE_PORT ?? 5001),
    },
  });

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  await app.startAllMicroservices();
  await app.listen(5002);
  console.log('Database service: TCP 5001 + HTTP 5002');
}

bootstrap().catch(console.error);
