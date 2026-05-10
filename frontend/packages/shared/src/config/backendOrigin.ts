/**
 * Локальні Nest-сервіси. Хост для URL має збігатися з тим, як відкрито фронт (localhost vs 127.0.0.1),
 * інакше MF + cookies + CORS роз’їжджаються; проксі інколи показує це як 502.
 */
export const DEFAULT_BACKEND_LOOPBACK_HOST = '127.0.0.1';

/** Якщо сторінка на localhost або 127.0.0.1 — API на той самий hostname; інакше fallback (LAN тощо). */
export function devLoopbackHostname(): string {
  if (typeof window !== 'undefined') {
    const h = window.location.hostname;
    if (h === 'localhost' || h === '127.0.0.1') {
      return h;
    }
  }
  return DEFAULT_BACKEND_LOOPBACK_HOST;
}

export function backendOriginForPort(port: number): string {
  return `http://${devLoopbackHostname()}:${port}`;
}

/** Приводить `http://localhost:…` / `http://127.0.0.1:…` до поточного loopback-host сторінки. */
export function preferIpv4LoopbackUrl(url: string): string {
  if (!url || typeof url !== 'string') return url;
  const h = devLoopbackHostname();
  return url
    .replace(/^http:\/\/localhost(?=:|\/|$)/i, `http://${h}`)
    .replace(/^http:\/\/127\.0\.0\.1(?=:|\/|$)/i, `http://${h}`);
}
