import { existsSync } from 'fs';
import { resolve } from 'path';
import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function loadEnv(): void {
  const candidates = [
    resolve(__dirname, '..', '.env'),
    resolve(process.cwd(), '.env'),
    resolve(process.cwd(), 'services', 'analytics-service', '.env'),
  ];
  const seen = new Set<string>();
  for (const p of candidates) {
    if (seen.has(p)) continue;
    seen.add(p);
    if (existsSync(p)) {
      dotenv.config({ path: p });
    }
  }
}

loadEnv();

/**
 * Server-side events go to GA4 (Firebase-linked property) via Measurement Protocol.
 * Copy `.env.example` → `.env` in this service and set GA4_MEASUREMENT_ID + GA4_API_SECRET.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: 'GET,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  const port = Number(process.env.PORT ?? 5007);
  await app.listen(port);

  const mid = process.env.GA4_MEASUREMENT_ID?.trim();
  const sec = process.env.GA4_API_SECRET?.trim();
  const ga4Ready = Boolean(mid && sec);
  const ga4Hint = ga4Ready
    ? ''
    : !mid && !sec
      ? ' — задайте GA4_MEASUREMENT_ID та GA4_API_SECRET у .env (див. analytics-service/.env.example)'
      : !sec
        ? ' — додайте GA4_API_SECRET (GA4 Admin → Data streams → Web → Measurement Protocol API secrets)'
        : ' — додайте GA4_MEASUREMENT_ID';
  console.log(`[analytics-service] HTTP :${port} | GA4 MP: ${ga4Ready ? 'увімкнено' : 'вимкнено'}${ga4Hint}`);
}
bootstrap();
