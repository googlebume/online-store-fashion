import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: 'GET,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
  })

  const port = Number(process.env.PORT ?? 5007);
  await app.listen(port);
  console.log(`[analytics-service] HTTP :${port} (не 5006 — той порт зарезервовано під TCP order-service)`);
}
bootstrap();
