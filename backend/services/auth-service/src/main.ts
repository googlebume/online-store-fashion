import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3004', 'http://localhost:3005'],
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 4004);
}
bootstrap();
