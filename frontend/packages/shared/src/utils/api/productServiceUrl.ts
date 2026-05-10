/// <reference path="./product-service-env.d.ts" />

/** Base URL for product-service (catalog, shop-dynamically, product pages). Default matches Nest `PORT ?? 5002`. */
export function getProductServiceBaseUrl(): string {
  if (typeof __PRODUCT_SERVICE_BASE_URL__ !== 'undefined') {
    const raw = String(__PRODUCT_SERVICE_BASE_URL__).trim();
    if (raw) {
      return raw.replace(/\/$/, '');
    }
  }

  try {
    const env = (import.meta as { env?: { VITE_PRODUCT_SERVICE_URL?: string } }).env;
    if (env?.VITE_PRODUCT_SERVICE_URL) {
      return env.VITE_PRODUCT_SERVICE_URL.replace(/\/$/, '');
    }
  } catch {
    /* non-Vite */
  }
  return 'http://localhost:5002';
}
