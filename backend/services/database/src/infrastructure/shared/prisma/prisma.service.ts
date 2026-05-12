import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../../prisma/generated';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    await this.normalizeLegacyOrderStatuses();
    await this.normalizeProductImageUrls();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private async normalizeProductImageUrls() {
    // Strip any origin prefix, keeping only the relative path "products/<filename>"
    const result = await this.$executeRaw`
      UPDATE "Products"
      SET "image" = regexp_replace("image", '^https?://[^/]+/', '')
      WHERE "image" ~ '^https?://'
    `;
    if (Number(result) > 0) {
      this.logger.warn(`[normalizeProductImageUrls] Normalized ${result} product image URL(s) to relative paths`);
    }
  }

  private async normalizeLegacyOrderStatuses() {
    const legacyStatusMap: Array<{ from: string; to: string }> = [
      { from: 'pending', to: 'Pending' },
      { from: 'delivered', to: 'Delivered' },
      { from: 'declined', to: 'Declined' },
      { from: 'canceled', to: 'Canceled' },
      { from: 'cancelled', to: 'Canceled' },
      { from: 'received', to: 'Received' },
      { from: 'processing', to: 'Processing' },
      { from: 'in progress', to: 'Processing' },
      { from: 'in_progress', to: 'Processing' },
      { from: 'accepted', to: 'Accepted' },
    ];

    for (const { from, to } of legacyStatusMap) {
      const result = await this.$executeRawUnsafe(
        `UPDATE "Order" SET "status" = '${to}'::"OrderStatus" WHERE lower("status"::text) = '${from}'`
      );

      if (Number(result) > 0) {
        this.logger.warn(`[normalizeLegacyOrderStatuses] Updated ${result} order(s): "${from}" -> "${to}"`);
      }
    }
  }
}
