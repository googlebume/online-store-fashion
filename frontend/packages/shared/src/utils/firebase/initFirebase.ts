/// <reference path="./firebase-env.d.ts" />
import type { FirebaseApp } from 'firebase/app';
import type { Analytics } from 'firebase/analytics';

let firebaseApp: FirebaseApp | null = null;
let firebaseAnalytics: Analytics | null = null;

function readWebConfig(): Record<string, string> {
  if (typeof __FIREBASE_WEB_CONFIG__ === 'undefined') {
    return {};
  }
  return { ...__FIREBASE_WEB_CONFIG__ };
}

/**
 * Ініціалізує Firebase App + Analytics для того самого Web stream (measurementId), що й GA4 MP на бекенді.
 * Конфіг збирається на етапі збірки host з змінних FIREBASE_* (.env).
 */
export async function initFirebaseClient(): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  const config = readWebConfig();
  if (!config.apiKey || !config.projectId) {
    console.warn(
      '[Firebase] Додайте у frontend/services/host/.env змінні FIREBASE_API_KEY та FIREBASE_PROJECT_ID (див. .env.example).',
    );
    return;
  }

  const appMod = await import('firebase/app');
  const { getAnalytics, isSupported } = await import('firebase/analytics');

  if (!appMod.getApps().length) {
    firebaseApp = appMod.initializeApp({
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId,
      measurementId: config.measurementId,
    });
  } else {
    firebaseApp = appMod.getApp();
  }

  if (await isSupported()) {
    firebaseAnalytics = getAnalytics(firebaseApp);
  }
}

export function getFirebaseApp(): FirebaseApp | null {
  return firebaseApp;
}

export function getFirebaseAnalytics(): Analytics | null {
  return firebaseAnalytics;
}
