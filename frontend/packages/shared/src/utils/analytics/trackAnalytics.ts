import JwtHandler from '../jwt';

const SESSION_KEY = 'fashion_analytics_session_v1';
const CLIENT_KEY = 'fashion_analytics_client_v1';

function randomId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function getAnalyticsSessionId(): string {
  if (typeof sessionStorage === 'undefined') {
    return randomId();
  }
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = randomId();
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

/** Stable id for GA4 Measurement Protocol / correlation (stored in localStorage). */
export function getAnalyticsClientId(): string {
  if (typeof localStorage === 'undefined') {
    return randomId();
  }
  let cid = localStorage.getItem(CLIENT_KEY);
  if (!cid) {
    cid = randomId();
    localStorage.setItem(CLIENT_KEY, cid);
  }
  return cid;
}

function getOptionalUserId(): string | undefined {
  try {
    const j = new JwtHandler();
    const p = j.decryptJwt() as { id?: string; userId?: string; sub?: string } | null;
    if (!p) return undefined;
    const id = p.id ?? p.userId ?? p.sub;
    return typeof id === 'string' ? id : id != null ? String(id) : undefined;
  } catch {
    return undefined;
  }
}

export type TrackPayload = {
  name: string;
  sessionId?: string;
  userId?: string;
  productId?: string;
  path?: string;
  durationMs?: number;
  payload?: Record<string, unknown>;
  clientId?: string;
};

const DEFAULT_BASE = 'http://localhost:5007';

export function getAnalyticsBaseUrl(): string {
  try {
    const env = (import.meta as { env?: { VITE_ANALYTICS_URL?: string } }).env;
    if (env?.VITE_ANALYTICS_URL) {
      return env.VITE_ANALYTICS_URL.replace(/\/$/, '');
    }
  } catch {
    /* non-Vite */
  }
  return DEFAULT_BASE;
}

/**
 * Sends one analytics event to the analytics-service HTTP API (stored in DB + forwarded to GA4 when configured).
 */
export function trackAnalytics(part: TrackPayload): void {
  if (typeof window === 'undefined') return;

  const base = getAnalyticsBaseUrl();
  const sessionId = part.sessionId ?? getAnalyticsSessionId();
  const clientId = part.clientId ?? getAnalyticsClientId();
  const path = part.path ?? `${window.location.pathname}${window.location.search}`;
  const userId = part.userId ?? getOptionalUserId();

  const body: TrackPayload = {
    name: part.name,
    sessionId,
    clientId,
    path,
    userId,
    productId: part.productId,
    durationMs: part.durationMs,
    payload: part.payload,
  };

  const url = `${base}/fashion/analytics/events`;

  try {
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}
