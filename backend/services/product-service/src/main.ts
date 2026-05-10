import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import { setupSwagger } from '@packages/shared/common/swagger/setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerPath = setupSwagger(app, {
    serviceName: 'Product Service',
    serviceDescription: 'Catalog, product details and product review endpoints.',
  });

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });
  app.use('/products', express.static(join(__dirname, '..', 'products')));

  const port = Number(process.env.PORT ?? 5002);
  await app.listen(port);

  if (swaggerPath) {
    console.log(`[product-service] Swagger UI: http://localhost:${port}/${swaggerPath}`);
  }
}
bootstrap();
