import { NestFactory } from '@nestjs/core';
import { OrderModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: "GET,POST",
    asllowedHeaders: "Content-Type"
  })
  await app.listen(process.env.PORT ?? 4006 );
}
bootstrap();
