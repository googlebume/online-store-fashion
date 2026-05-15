import * as path from 'path';
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '../prisma/generated';

function buildClientOptions(): ConstructorParameters<typeof PrismaClient>[0] {
    const url = process.env.DATABASE_URL ?? 'file:./dev.db';

    if (url.startsWith('file:') || url.startsWith('libsql:')) {
        const { PrismaLibSql } = require('@prisma/adapter-libsql') as typeof import('@prisma/adapter-libsql');
        const absUrl = url.startsWith('file:.') ? 'file:' + path.resolve(url.slice(5)) : url;
        return { adapter: new PrismaLibSql({ url: absUrl }) };
    }

    const { PrismaPg } = require('@prisma/adapter-pg') as typeof import('@prisma/adapter-pg');
    return { adapter: new PrismaPg({ connectionString: url }) };
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);
    private readonly isSqlite: boolean;

    constructor() {
        const url = process.env.DATABASE_URL ?? 'file:./dev.db';
        super(buildClientOptions());
        this.isSqlite = url.startsWith('file:') || url.startsWith('libsql:');
    }

    async onModuleInit() {
        await this.$connect();
        if (!this.isSqlite) {
            await this.normalizeLegacyOrderStatuses();
        }
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
                `UPDATE "Order" SET "status" = '${to}'::"OrderStatus" WHERE lower("status"::text) = '${from}'`
            );
            if (Number(result) > 0) {
                this.logger.warn(`[normalizeLegacyOrderStatuses] Updated ${result} order(s): "${from}" -> "${to}"`);
            }
        }
    }
}
