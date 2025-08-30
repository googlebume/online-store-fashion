import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DatabaseModule } from './database.module';

async function bootstrap() {
  const httpApp = await NestFactory.create(DatabaseModule);
  
  httpApp.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  await httpApp.listen(5002);



  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(
    DatabaseModule,
    {
      transport: Transport.TCP,
      options: { host: 'localhost', port: 5001 },
    },
  );
  
  await microservice.listen();
  console.log('Database microservice is running on port 5001');
}
bootstrap();