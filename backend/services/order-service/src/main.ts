import { NestFactory } from '@nestjs/core';
import { OrderModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);
  await app.listen(process.env.PORT ?? 4006 );
}
bootstrap();
