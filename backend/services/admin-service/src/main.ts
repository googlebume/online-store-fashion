import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from '@packages/shared/common/swagger/setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerPath = setupSwagger(app, {
    serviceName: 'Admin Service',
    serviceDescription: 'Admin endpoints for users, products, orders and promo codes.',
    bearerAuth: true,
  });

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  
  const port = Number(process.env.PORT ?? 5004);
  await app.listen(port);

  if (swaggerPath) {
    console.log(`[admin-service] Swagger UI: http://localhost:${port}/${swaggerPath}`);
  }
}
bootstrap();
