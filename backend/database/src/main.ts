// import { NestFactory } from '@nestjs/core';
// import { DatabaseModule } from './database.module';

// async function bootstrap() {
//   const app = await NestFactory.create(DatabaseModule);
//   await app.listen(process.env.PORT ?? 5001);
// }
// bootstrap();


import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DatabaseModule } from './database.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    DatabaseModule,
    {
      transport: Transport.TCP,  // Використовуємо TCP
      options: { host: 'localhost', port: 5001 }, // Порт для зв'язку
    },
  );
  await app.listen();
  console.log('Database microservice is running on port 5001');
}
bootstrap();
