import { Injectable, Logger } from '@nestjs/common';

type Ga4Event = { name: string; params?: Record<string, string | number | null | undefined> };

/**
 * Sends events to Google Analytics 4 via the Measurement Protocol.
 * In Firebase, link the GA4 property (Web stream) and create a Measurement Protocol API secret
 * (GA4 Admin → Data streams → your stream → Measurement Protocol API secrets).
 * Set GA4_MEASUREMENT_ID (e.g. G-XXXX) and GA4_API_SECRET in the environment.
 */
@Injectable()
export class Ga4Service {
  private readonly logger = new Logger(Ga4Service.name);

  async sendEvents(clientId: string, events: Ga4Event[]): Promise<void> {
    const measurementId = process.env.GA4_MEASUREMENT_ID;
    const apiSecret = process.env.GA4_API_SECRET;
    if (!measurementId || !apiSecret) {
      this.logger.debug('GA4_MEASUREMENT_ID or GA4_API_SECRET not set; skipping GA4 send');
      return;
    }
    if (!clientId || !events.length) {
      return;
    }

    const url = new URL('https://www.google-analytics.com/mp/collect');
    url.searchParams.set('measurement_id', measurementId);
    url.searchParams.set('api_secret', apiSecret);

    const chunkSize = 25;
    for (let i = 0; i < events.length; i += chunkSize) {
      const slice = events.slice(i, i + chunkSize);
      const body = {
        client_id: clientId,
        events: slice.map((e) => ({
          name: this.sanitizeEventName(e.name),
          params: this.flattenParams(e.params),
        })),
      };

      try {
        const res = await fetch(url.toString(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          this.logger.warn(`GA4 MP failed ${res.status}: ${text}`);
        }
      } catch (err) {
        this.logger.warn(`GA4 MP request error: ${(err as Error).message}`);
      }
    }
  }

  private sanitizeEventName(name: string): string {
    const s = name.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 40);
    return s.length ? s : 'custom_event';
  }

  private flattenParams(
    params?: Record<string, string | number | null | undefined>,
  ): Record<string, string | number> | undefined {
    if (!params) return undefined;
    const out: Record<string, string | number> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v === null || v === undefined) continue;
      const key = k.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 40);
      if (!key) continue;
      out[key] = typeof v === 'number' ? v : String(v).slice(0, 100);
    }
    return Object.keys(out).length ? out : undefined;
  }
}
