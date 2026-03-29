import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        const adapter = new PrismaBetterSqlite3({
            url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
        });

        super({ adapter });
    }

    async onModuleInit() {
        await this.$connect();
        await this.normalizeLegacyOrderStatuses();
    }

    async onModuleDestroy() {
        await this.$disconnect();
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
                `UPDATE "Order" SET "status" = '${to}' WHERE lower("status") = '${from}'`
            );

            if (Number(result) > 0) {
                this.logger.warn(`[normalizeLegacyOrderStatuses] Updated ${result} order(s): "${from}" -> "${to}"`);
            }
        }
    }
}
