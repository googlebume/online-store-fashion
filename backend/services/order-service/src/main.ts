import { NestFactory } from '@nestjs/core';
import { OrderModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: "GET,POST",
    asllowedHeaders: "Content-Type"
  })
  await app.listen(process.env.PORT ?? 4006);

  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrderModule,
    {
      transport: Transport.TCP,
      options: { host: 'localhost', port: 5006 },
    },
  );

  await microservice.listen();
}
bootstrap();
