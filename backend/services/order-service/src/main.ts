import { NestFactory } from '@nestjs/core';
import { OrderModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { setupSwagger } from '@packages/shared/common/swagger/setup-swagger';

/**
 * Один процес Nest: HTTP + TCP microservice (адмін-клієнт підключається до TCP).
 */
async function bootstrap() {
  const httpPort = Number(process.env.PORT ?? 5005);
  const tcpHost = process.env.ORDER_MICROSERVICE_HOST ?? '0.0.0.0';
  const tcpPort = Number(process.env.ORDER_MICROSERVICE_PORT ?? 5006);

  const app = await NestFactory.create(OrderModule);
  const swaggerPath = setupSwagger(app, {
    serviceName: 'Order Service',
    serviceDescription: 'Customer checkout, promo-code validation and order history endpoints.',
    bearerAuth: true,
  });

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: tcpHost,
      port: tcpPort,
    },
  });

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3005'],
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type, Authorization',
  });

  await app.startAllMicroservices();
  await app.listen(httpPort);

  console.log(
    `[order-service] OK — HTTP :${httpPort} | TCP microservice ${tcpHost}:${tcpPort} (admin-service очікує 127.0.0.1:${tcpPort}, змініть ORDER_SERVICE_HOST/PORT за потреби)`,
  );
  if (swaggerPath) {
    console.log(`[order-service] Swagger UI: http://localhost:${httpPort}/${swaggerPath}`);
  }
}

bootstrap().catch((err: NodeJS.ErrnoException & { code?: string }) => {
  const tcpPort = Number(process.env.ORDER_MICROSERVICE_PORT ?? 5006);
  const httpPort = Number(process.env.PORT ?? 5005);

  if (err?.code === 'EADDRINUSE') {
    const p = (err as any).port ?? tcpPort;
    console.error(
      `[order-service] Порт ${p} вже зайнятий (EADDRINUSE). Зазвичай це:\n` +
        `  • старий процес order-service після Ctrl+C / падіння;\n` +
        `  • другий запуск того самого сервісу;\n` +
        `  • під час "nest start --watch" старий процес ще не встиг звільнити порт.\n\n` +
        `Звільніть порт і перезапустіть:\n` +
        `  ss -tlnp | grep :${p}\n` +
        `  kill <PID>        або    fuser -k ${p}/tcp\n\n` +
        `Або використайте інші порти (узгодьте з admin-service):\n` +
        `  ORDER_MICROSERVICE_PORT=5016 PORT=5015 npm run start:dev\n` +
        `  і в admin: ORDER_SERVICE_PORT=5016 ORDER_HTTP не потрібен — лише TCP-клієнт до 5016`,
    );
    process.exit(1);
    return;
  }

  console.error(`[order-service] Помилка старту (HTTP ${httpPort}, TCP ${tcpPort}):`, err);
  process.exit(1);
});
