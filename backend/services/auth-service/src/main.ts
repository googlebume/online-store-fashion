import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { setupSwagger } from '@packages/shared/common/swagger/setup-swagger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerPath = setupSwagger(app, {
    serviceName: 'Auth Service',
    serviceDescription: 'Authentication, registration, Google auth and profile endpoints.',
    bearerAuth: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    /** Локальний MF: і localhost, і 127.0.0.1 — інакше запити з фронта стають cross-origin і падають */
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const port = Number(process.env.PORT ?? 5003);
  await app.listen(port);

  if (swaggerPath) {
    console.log(`[auth-service] Swagger UI: http://localhost:${port}/${swaggerPath}`);
  }
}
bootstrap();
