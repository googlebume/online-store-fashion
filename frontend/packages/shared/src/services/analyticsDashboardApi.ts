import { getAnalyticsBaseUrl } from '../utils/analytics/trackAnalytics';

export type AnalyticsTotals = {
  allTime: number;
  last24h: number;
  uniqueSessions: number;
};

export type AnalyticsEventBreakdown = {
  name: string;
  count: number;
};

export type AnalyticsDayBucket = {
  date: string;
  count: number;
};

export type AnalyticsRecentEvent = {
  id: string;
  name: string;
  path: string | null;
  sessionId: string | null;
  userId: string | null;
  productId: string | null;
  durationMs: number | null;
  payload: unknown;
  createdAt: string;
};

export type AnalyticsTopProduct = {
  productId: string;
  views: number;
  clicks: number;
  orders: number;
  productName: string | null;
  image: string | null;
};

export type AnalyticsDashboardData = {
  totals: AnalyticsTotals;
  eventsByName: AnalyticsEventBreakdown[];
  last7Days: AnalyticsDayBucket[];
  recentEvents: AnalyticsRecentEvent[];
  topProductsByViews: AnalyticsTopProduct[];
};

type DashboardApiResponse = {
  success?: boolean;
  data?: AnalyticsDashboardData;
  message?: string;
};

/**
 * Loads aggregated analytics for the admin dashboard from analytics-service (HTTP).
 */
export async function fetchAnalyticsDashboard(): Promise<AnalyticsDashboardData> {
  const base = getAnalyticsBaseUrl();
  const res = await fetch(`${base}/fashion/analytics/dashboard`);
  let body: DashboardApiResponse = {};
  try {
    body = (await res.json()) as DashboardApiResponse;
  } catch {
    throw new Error('Некоректна відповідь сервера аналітики');
  }

  if (!res.ok) {
    throw new Error(body.message || `Помилка ${res.status}`);
  }
  if (body.success === false || !body.data) {
    throw new Error(body.message || 'Не вдалося завантажити аналітику');
  }

  return body.data;
}
