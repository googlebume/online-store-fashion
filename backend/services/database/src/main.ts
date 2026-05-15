import { config } from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
  config({ path: '.env.development' });
}

import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './interface/app.module';
import { setupSwagger } from '@packages/shared/common/swagger/setup-swagger';

/**
 * Один Nest-додаток: TCP microservice (5001) + HTTP (5000).
 * Два окремі NestFactory на одному модулі небажані для стабільного TCP.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerPath = setupSwagger(app, {
    serviceName: 'Database Service',
    serviceDescription: 'Static file hosting and internal database-facing HTTP surface.',
  });

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
  const port = Number(process.env.PORT ?? 5000);
  await app.listen(port);
  console.log(
    `Database service: TCP ${process.env.DATABASE_MICROSERVICE_PORT ?? 5001} + HTTP ${port}`,
  );
  if (swaggerPath) {
    console.log(`[database] Swagger UI: http://localhost:${port}/${swaggerPath}`);
  }
}

bootstrap().catch(console.error);
