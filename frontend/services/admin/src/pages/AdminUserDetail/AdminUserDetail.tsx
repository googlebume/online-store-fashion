import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import cl from './AdminUserDetail.module.scss';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
import { getProductServiceBaseUrl } from '@packages/shared/src/utils/api/productServiceUrl';
import Cookies from '@packages/shared/src/utils/cookies';
import type { UserDataType } from '@packages/shared/src/utils/types/userData.type';
import type { OrderDataType } from '@packages/shared/src/utils/types/orderData.type';
import type { UserReviewItem, UserReviewsListResponse } from '@packages/shared/src/types/reviews.types';
import userIcon from '@packages/shared/src/assets/images/icons/userIcon.png';

const STATUS_LABELS: Record<string, string> = {
  Pending: 'Очікує',
  Processing: 'Обробляється',
  Accepted: 'Прийнято',
  Received: 'Отримано',
  Delivered: 'Доставлено',
  Declined: 'Відхилено',
  Canceled: 'Скасовано',
};

function formatRelativeTimeUk(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days < 0) return d.toLocaleDateString('uk-UA');
  if (days === 0) return 'сьогодні';
  if (days === 1) return 'вчора';
  if (days < 7) return `${days} дн. тому`;
  if (days < 30) return `${Math.floor(days / 7)} тиж. тому`;
  if (days < 365) return `${Math.floor(days / 30)} міс. тому`;
  return d.toLocaleDateString('uk-UA');
}

function renderStars(rating: number, cl: any) {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`${cl.star} ${i < rating ? cl.filled : ''}`}>★</span>
  ));
}

const AdminUserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDataType | null>(null);
  const [orders, setOrders] = useState<OrderDataType[]>([]);
  const [reviews, setReviews] = useState<UserReviewItem[]>([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  const { response: usersResponse, fetchData: fetchUsers } = useFetch<null, UserDataType[]>();
  const { response: ordersResponse, fetchData: fetchOrders } = useFetch<null, OrderDataType[]>();
  const { response: reviewsResponse, isLoading: reviewsLoading, fetchData: fetchReviews } = useFetch<null, UserReviewsListResponse>();

  useEffect(() => {
    fetchUsers({ method: 'GET', url: 'admin/users', port: 5004 });
    fetchOrders({ method: 'GET', url: 'admin/orders', port: 5004 });
  }, []);

  useEffect(() => {
    if (!usersResponse || !userId) return;
    const found = (usersResponse as UserDataType[]).find((u) => String(u.id) === userId);
    setUser(found ?? null);
  }, [usersResponse, userId]);

  useEffect(() => {
    if (!ordersResponse || !userId) return;
    const userOrders = (ordersResponse as OrderDataType[]).filter((o) => String(o.userId) === userId);
    setOrders(userOrders);
  }, [ordersResponse, userId]);

  useEffect(() => {
    if (!userId) return;
    fetchReviews({
      method: 'GET',
      url: `admin/reviews/by-user/${userId}?page=1&limit=10`,
      baseUrl: getProductServiceBaseUrl(),
    });
  }, [userId]);

  useEffect(() => {
    if (!reviewsResponse || typeof reviewsResponse !== 'object') return;
    const res = reviewsResponse as UserReviewsListResponse;
    if (!Array.isArray(res.data)) return;
    const resPage = res.meta?.page ?? 1;
    setHasMoreReviews(Boolean(res.meta?.hasMore));
    if (resPage <= 1) {
      setReviews(res.data);
    } else {
      setReviews((prev) => [...prev, ...res.data]);
    }
  }, [reviewsResponse]);

  const handleDeleteReview = useCallback(async (reviewId: string) => {
    setDeletingReviewId(reviewId);
    try {
      const cookies = new Cookies();
      const token = cookies.getCookie('token');
      const res = await fetch(`${getProductServiceBaseUrl()}/fashion/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      }
    } finally {
      setDeletingReviewId(null);
    }
  }, []);

  const loadMoreReviews = () => {
    const nextPage = reviewPage + 1;
    setReviewPage(nextPage);
    fetchReviews({
      method: 'GET',
      url: `admin/reviews/by-user/${userId}?page=${nextPage}&limit=10`,
      baseUrl: getProductServiceBaseUrl(),
    });
  };

  if (!user) {
    return <div className={cl.loading}>Завантаження…</div>;
  }

  return (
    <div className={cl.layout}>
      <button type="button" className={cl.backBtn} onClick={() => navigate(-1)}>
        ← Назад до користувачів
      </button>

      <div className={cl.userHeader}>
        <div className={cl.avatar}>
          <img src={user.avatar || userIcon} alt={user.name} />
        </div>
        <div className={cl.userInfo}>
          <h1 className={cl.userName}>{user.name}</h1>
          <p className={cl.userEmail}>{user.email}</p>
          <div className={cl.userMeta}>
            <span className={cl.userRole}>
              {Array.isArray(user.role) ? user.role.join(', ') : user.role}
            </span>
            {user.createdAt && (
              <span className={cl.userDate}>
                Зареєстровано: {new Date(user.createdAt).toLocaleDateString('uk-UA')}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={cl.section}>
        <h2 className={cl.sectionTitle}>Замовлення ({orders.length})</h2>
        {orders.length === 0 ? (
          <p className={cl.empty}>Замовлень немає.</p>
        ) : (
          <div className={cl.ordersList}>
            {orders.map((order) => (
              <div key={order.id} className={cl.orderCard}>
                <div className={cl.orderHeader}>
                  <span className={cl.orderId}>#{order.id.slice(0, 8)}</span>
                  <span className={cl.orderDate}>{new Date(order.createdAt).toLocaleDateString('uk-UA')}</span>
                  <span className={cl.orderStatusBadge}>
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>
                <div className={cl.orderMeta}>
                  <span>Доставка: {order.deliveryMethod}</span>
                  <span>Email: {order.email}</span>
                  {order.promoCode && <span>Промокод: {order.promoCode}</span>}
                </div>
                <p className={cl.orderTotal}>
                  Сума: {order.total.toFixed(2)} ₴ · {order.items?.length ?? 0} товарів
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={cl.section}>
        <h2 className={cl.sectionTitle}>Відгуки ({reviews.length})</h2>
        {reviews.length === 0 && !reviewsLoading ? (
          <p className={cl.empty}>Відгуків немає.</p>
        ) : (
          <div className={cl.reviewList}>
            {reviews.map((r) => (
              <div key={r.id} className={cl.reviewItem}>
                <div className={cl.reviewHeader}>
                  <div className={cl.reviewStars}>{renderStars(r.stars, cl)}</div>
                  <span className={cl.reviewProductTag}>{r.productName}</span>
                  <span className={cl.reviewDate}>{formatRelativeTimeUk(r.createdAt)}</span>
                  <button
                    type="button"
                    className={cl.deleteReviewBtn}
                    disabled={deletingReviewId === r.id}
                    onClick={() => handleDeleteReview(r.id)}
                  >
                    {deletingReviewId === r.id ? '…' : '✕ Видалити'}
                  </button>
                </div>
                {r.reviewTitle && <p className={cl.reviewTitle}>{r.reviewTitle}</p>}
                <p className={cl.reviewText}>{r.text}</p>
              </div>
            ))}
          </div>
        )}
        {hasMoreReviews && (
          <button
            type="button"
            className={cl.loadMoreBtn}
            onClick={loadMoreReviews}
            disabled={reviewsLoading}
          >
            {reviewsLoading ? 'Завантаження…' : 'Показати більше'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminUserDetail;
