import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
  })
  
  await app.listen(process.env.PORT ?? 4005 );
}
bootstrap();
