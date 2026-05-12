/**
 * Backend service origins.
 * In development: http://127.0.0.1:PORT (loopback).
 * In production:  webpack DefinePlugin injects Railway HTTPS URLs per port.
 */
export const DEFAULT_BACKEND_LOOPBACK_HOST = '127.0.0.1';

export function devLoopbackHostname(): string {
  if (typeof window !== 'undefined') {
    const h = window.location.hostname;
    if (h === 'localhost' || h === '127.0.0.1') {
      return h;
    }
  }
  return DEFAULT_BACKEND_LOOPBACK_HOST;
}

function _url(v: string | undefined): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim().replace(/\/$/, '') : undefined;
}

function _buildServiceUrlMap(): Partial<Record<number, string>> {
  const map: Partial<Record<number, string>> = {};
  try { const v = _url(__DATABASE_SERVICE_BASE_URL__); if (v) map[5000] = v; } catch { /* not defined */ }
  try { const v = _url(__PRODUCT_SERVICE_BASE_URL__);  if (v) map[5002] = v; } catch { /* not defined */ }
  try { const v = _url(__AUTH_SERVICE_URL__);           if (v) map[5003] = v; } catch { /* not defined */ }
  try { const v = _url(__ADMIN_SERVICE_URL__);          if (v) map[5004] = v; } catch { /* not defined */ }
  try { const v = _url(__ORDER_SERVICE_URL__);          if (v) map[5005] = v; } catch { /* not defined */ }
  try { const v = _url(__ANALYTICS_SERVICE_URL__);     if (v) map[5007] = v; } catch { /* not defined */ }
  return map;
}

const _SERVICE_URLS = _buildServiceUrlMap();

export function backendOriginForPort(port: number): string {
  const url = _SERVICE_URLS[port];
  if (url) return url;
  return 'http://' + devLoopbackHostname() + ':' + port;
}

export function preferIpv4LoopbackUrl(url: string): string {
  if (!url || typeof url !== 'string') return url;
  if (url.startsWith('https://')) return url;
  const h = devLoopbackHostname();
  return url
    .replace(/^http:\/\/localhost(?=:|\/|$)/i, 'http://' + h)
    .replace(/^http:\/\/127\.0\.0\.1(?=:|\/|$)/i, 'http://' + h);
}
