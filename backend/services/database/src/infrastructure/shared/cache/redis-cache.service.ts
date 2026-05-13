import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

const PRODUCTS_TTL = 300; // 5 minutes

@Injectable()
export class RedisCacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisCacheService.name);
  private client: Redis | null = null;

  onModuleInit() {
    const url = process.env.REDIS_URL;
    if (!url) {
      this.logger.warn('REDIS_URL not set — product caching disabled');
      return;
    }
    this.client = new Redis(url, { lazyConnect: false, maxRetriesPerRequest: 2 });
    this.client.on('error', (err) => this.logger.error(`Redis error: ${err.message}`));
    this.logger.log('Redis cache connected');
  }

  async onModuleDestroy() {
    await this.client?.quit();
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client) return null;
    try {
      const val = await this.client.get(key);
      return val ? (JSON.parse(val) as T) : null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown, ttl = PRODUCTS_TTL): Promise<void> {
    if (!this.client) return;
    try {
      await this.client.set(key, JSON.stringify(value), 'EX', ttl);
    } catch {}
  }

  async invalidateProducts(): Promise<void> {
    if (!this.client) return;
    try {
      const keys = await this.client.keys('products:*');
      if (keys.length) await this.client.del(...keys);
    } catch {}
  }
}
