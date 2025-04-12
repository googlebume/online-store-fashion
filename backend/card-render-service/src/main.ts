import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // Адреса фронтенду
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
  });
  app.use('/products', express.static(join(__dirname, '..', 'products')));

  
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
