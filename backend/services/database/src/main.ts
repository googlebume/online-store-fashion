import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './interface/app.module';

async function bootstrap() {
  const httpApp = await NestFactory.create(AppModule);

  httpApp.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  await httpApp.listen(5002);
  console.log('Database service HTTP server listening on port 5002');

  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: { host: 'localhost', port: 5001 },
    },
  );

  await microservice.listen();
  console.log('Database microservice is running on port 5001');
}

bootstrap().catch(console.error);