import React, { useCallback, useEffect, useState } from 'react';
import {
  fetchAnalyticsDashboard,
  fetchPromoRedemptionStats,
  type AnalyticsDashboardData,
  type PromoRedemptionRow,
} from '@packages/shared/src/services/analyticsDashboardApi';
import Button from '@packages/shared/src/components/UI/Button/Button';
import cl from './AdminAnalytics.module.scss';

function formatUaDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function formatDayLabel(isoDate: string): string {
  try {
    const d = new Date(isoDate + 'T12:00:00');
    return d.toLocaleDateString('uk-UA', { weekday: 'short', day: 'numeric', month: 'short' });
  } catch {
    return isoDate;
  }
}

function payloadPreview(payload: unknown): string {
  if (payload === null || payload === undefined) return '—';
  try {
    const s = JSON.stringify(payload);
    return s.length > 120 ? `${s.slice(0, 120)}…` : s;
  } catch {
    return '—';
  }
}

const AdminAnalytics = () => {
  const [data, setData] = useState<AnalyticsDashboardData | null>(null);
  const [promoRows, setPromoRows] = useState<PromoRedemptionRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dash = await fetchAnalyticsDashboard();
      setData(dash);
      const promos = await fetchPromoRedemptionStats().catch(() => [] as PromoRedemptionRow[]);
      setPromoRows(promos);
    } catch (e) {
      setError((e as Error).message || 'Помилка завантаження');
      setData(null);
      setPromoRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const maxDayCount =
    data?.last7Days?.length ?
      Math.max(1, ...data.last7Days.map((d) => d.count))
    : 1;

  const maxEventType =
    data?.eventsByName?.length ?
      Math.max(1, ...data.eventsByName.map((e) => e.count))
    : 1;

  if (loading && !data) {
    return <div className={cl.empty}>Завантаження аналітики…</div>;
  }

  if (error) {
    return (
      <section className={cl.layout}>
        <div className={`${cl.empty} ${cl.emptyStack}`}>
          <span>{error}</span>
          <Button variant="submit-secondary" text="Спробувати знову" onClick={() => void load()} />
        </div>
      </section>
    );
  }

  if (!data) {
    return <div className={cl.empty}>Немає даних</div>;
  }

  const { totals, eventsByName, last7Days, recentEvents, topProductsByViews } = data;

  return (
    <section className={cl.layout}>
      <div className={cl.toolbar}>
        <div>
          <h2 className={cl.title}>Аналітика</h2>
          <p className={cl.subtitle}>Загальна статистика відвідувань і подій на сайті</p>
        </div>
      </div>

      <div className={cl.statsRow}>
        <div className={cl.statCard}>
          <span className={cl.statLabel}>Усі події</span>
          <span className={cl.statValue}>{totals.allTime}</span>
        </div>
        <div className={cl.statCard}>
          <span className={cl.statLabel}>За 24 години</span>
          <span className={cl.statValue}>{totals.last24h}</span>
        </div>
        <div className={cl.statCard}>
          <span className={cl.statLabel}>Унікальні сесії</span>
          <span className={cl.statValue}>{totals.uniqueSessions}</span>
        </div>
      </div>

      <div className={cl.section}>
        <h3 className={cl.sectionTitle}>Активність за 7 днів</h3>
        <div className={cl.chartRow}>
          {last7Days.map((day) => {
            const hPct = Math.round((day.count / maxDayCount) * 100);
            return (
              <div key={day.date} className={cl.chartBarWrap}>
                <span className={cl.chartCount}>{day.count}</span>
                <div
                  className={cl.chartBar}
                  style={{ height: `${Math.max(8, hPct)}px` }}
                  title={`${day.date}: ${day.count}`}
                />
                <span className={cl.chartLabel}>{formatDayLabel(day.date)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className={cl.section}>
        <h3 className={cl.sectionTitle}>Промокоди: замовлення та унікальні користувачі</h3>
        <p style={{ margin: '0 0 12px', color: '#788387', fontSize: 14 }}>
          Джерело: події <code style={{ fontSize: 13 }}>promo_order_completed</code> (analytics-service → БД).
          Унікальні користувачі — авторизовані замовлення з заповненим userId у події.
        </p>
        <div className={cl.eventsTableWrap}>
          <table className={cl.eventsTable}>
            <thead>
              <tr>
                <th>Промокод</th>
                <th>Замовлень</th>
                <th>Унікальних юзерів</th>
              </tr>
            </thead>
            <tbody>
              {promoRows.map((row) => (
                <tr key={row.promoCode}>
                  <td className={cl.mono}>{row.promoCode}</td>
                  <td>{row.orders}</td>
                  <td>{row.distinctUsers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {promoRows.length === 0 ? (
          <p style={{ margin: 0, color: '#788387', fontSize: 14 }}>
            Поки немає зафіксованих покупок із промокодом (або аналітика недоступна).
          </p>
        ) : null}
      </div>

      <div className={cl.section}>
        <h3 className={cl.sectionTitle}>Події за типом</h3>
        <div className={cl.breakdown}>
          {eventsByName.map((row) => (
            <div key={row.name} className={cl.breakdownRow}>
              <span className={cl.breakdownName} title={row.name}>
                {row.name}
              </span>
              <span className={cl.breakdownCount}>{row.count}</span>
              <div className={cl.breakdownBarBg}>
                <div
                  className={cl.breakdownBarFill}
                  style={{ width: `${Math.round((row.count / maxEventType) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        {eventsByName.length === 0 ? (
          <p style={{ margin: 0, color: '#788387', fontSize: 14 }}>Поки немає подій</p>
        ) : null}
      </div>

      <div className={cl.section}>
        <h3 className={cl.sectionTitle}>Товари з найбільшою увагою (перегляди)</h3>
        <div className={cl.productsGrid}>
          {topProductsByViews.map((p) => (
            <article key={p.productId} className={cl.productCard}>
              {p.image ? (
                <img
                  className={cl.productThumb}
                  src={p.image.startsWith('http') ? p.image : `${window.location.origin}${p.image}`}
                  alt=""
                />
              ) : (
                <div className={cl.productThumb} />
              )}
              <div className={cl.productMeta}>
                <span className={cl.productName}>{p.productName || p.productId}</span>
                <span className={cl.productStats}>
                  Перегляди: {p.views} · Кліки: {p.clicks} · Замовлення: {p.orders}
                </span>
              </div>
            </article>
          ))}
        </div>
        {topProductsByViews.length === 0 ? (
          <p style={{ margin: 0, color: '#788387', fontSize: 14 }}>
            Немає агрегованих метрик по товарах
          </p>
        ) : null}
      </div>

      <div className={cl.section}>
        <h3 className={cl.sectionTitle}>Останні події</h3>
        <div className={cl.eventsTableWrap}>
          <table className={cl.eventsTable}>
            <thead>
              <tr>
                <th>Час</th>
                <th>Подія</th>
                <th>Шлях</th>
                <th>Деталі</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.map((ev) => (
                <tr key={ev.id}>
                  <td className={cl.mono}>{formatUaDate(ev.createdAt)}</td>
                  <td>{ev.name}</td>
                  <td className={cl.mono}>{ev.path || '—'}</td>
                  <td className={cl.mono}>{payloadPreview(ev.payload)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {recentEvents.length === 0 ? (
          <p style={{ margin: 0, color: '#788387', fontSize: 14 }}>Подій ще немає</p>
        ) : null}
      </div>
    </section>
  );
};

export default AdminAnalytics;
