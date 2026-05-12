/// <reference path="./product-service-env.d.ts" />

import { backendOriginForPort, preferIpv4LoopbackUrl } from '../../config/backendOrigin';

/** Base URL for product-service (catalog, shop-dynamically, product pages). Default matches Nest `PORT ?? 5002`. */
export function getProductServiceBaseUrl(): string {
  if (typeof __PRODUCT_SERVICE_BASE_URL__ !== 'undefined') {
    const raw = String(__PRODUCT_SERVICE_BASE_URL__).trim();
    if (raw) {
      return preferIpv4LoopbackUrl(raw.replace(/\/$/, ''));
    }
  }

  try {
    const env = (import.meta as { env?: { VITE_PRODUCT_SERVICE_URL?: string } }).env;
    if (env?.VITE_PRODUCT_SERVICE_URL) {
      return preferIpv4LoopbackUrl(env.VITE_PRODUCT_SERVICE_URL.replace(/\/$/, ''));
    }
  } catch {
    /* non-Vite */
  }
  return backendOriginForPort(5002);
}

function getDatabaseServiceBaseUrl(): string {
  try {
    const env = (import.meta as { env?: { VITE_DATABASE_SERVICE_URL?: string } }).env;
    if (env?.VITE_DATABASE_SERVICE_URL) return env.VITE_DATABASE_SERVICE_URL.replace(/\/$/, '');
  } catch { /* non-Vite */ }
  if (typeof __DATABASE_SERVICE_BASE_URL__ !== 'undefined') {
    const raw = String(__DATABASE_SERVICE_BASE_URL__).trim();
    if (raw) return raw.replace(/\/$/, '');
  }
  return backendOriginForPort(5000);
}

/**
 * Constructs a full image URL from a stored image path.
 * Images are served by the database service (port 5000 / VITE_DATABASE_SERVICE_URL).
 * Handles both legacy full URLs (http://...) and relative paths (products/filename.webp).
 */
export function getProductImageUrl(imagePath: string): string {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const base = getDatabaseServiceBaseUrl();
  return `${base}/${imagePath.replace(/^\//, '')}`;
}
