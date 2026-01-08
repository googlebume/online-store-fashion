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

  await app.listen(process.env.PORT ?? 5006);
  console.log("ANALYTICS SERVICE HAS BEEN STARTED")
}
bootstrap();
