import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { databaseClient } from '../database.client';
import { Ga4Service } from '../ga4/ga4.service';

export type IngestEventDto = {
  name: string;
  sessionId?: string;
  userId?: string;
  productId?: string;
  path?: string;
  durationMs?: number;
  payload?: Record<string, unknown>;
  clientId?: string;
};

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(private readonly ga4: Ga4Service) {}

  async ingest(events: IngestEventDto[]): Promise<{ stored: number; errors: string[] }> {
    const errors: string[] = [];
    let stored = 0;

    const ga4ByClient = new Map<string, { name: string; params: Record<string, string | number> }[]>();

    for (const ev of events) {
      if (!ev?.name) {
        errors.push('Skipped event without name');
        continue;
      }

      try {
        const dbResult = await lastValueFrom(
          databaseClient.send('create-analytics-event', {
            name: ev.name,
            sessionId: ev.sessionId,
            userId: ev.userId,
            productId: ev.productId,
            path: ev.path,
            durationMs: ev.durationMs,
            payload: ev.payload,
            clientId: ev.clientId,
          }),
        );
        if (dbResult?.success) {
          stored++;
        } else {
          errors.push(dbResult?.message || 'Database rejected event');
        }
      } catch (e) {
        this.logger.warn(`create-analytics-event failed: ${(e as Error).message}`);
        errors.push((e as Error).message);
      }

      const cid = ev.clientId || 'anonymous';
      const list = ga4ByClient.get(cid) ?? [];
      const params: Record<string, string | number> = {};
      if (ev.sessionId) params.session_id = ev.sessionId;
      if (ev.userId) params.user_id = ev.userId;
      if (ev.productId) params.product_id = ev.productId;
      if (ev.path) params.page_path = ev.path;
      if (ev.durationMs != null) params.engagement_time_msec = ev.durationMs;
      if (ev.payload && typeof ev.payload === 'object') {
        const pl = ev.payload as Record<string, unknown>;
        if (ev.name === 'promo_order_completed') {
          if (typeof pl.promo_code === 'string') params.promo_code = pl.promo_code.slice(0, 40);
          if (typeof pl.order_id === 'string') params.order_id = pl.order_id.slice(0, 40);
          if (typeof pl.promo_discount_total === 'number') params.promo_discount_total = pl.promo_discount_total;
        }
        try {
          params.event_detail = JSON.stringify(ev.payload).slice(0, 500);
        } catch {
          /* ignore */
        }
      }
      list.push({ name: ev.name, params });
      ga4ByClient.set(cid, list);
    }

    for (const [clientId, gaEvents] of ga4ByClient) {
      await this.ga4.sendEvents(clientId, gaEvents);
    }

    return { stored, errors };
  }
}
