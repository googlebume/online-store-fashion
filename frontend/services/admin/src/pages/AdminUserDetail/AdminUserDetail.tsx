import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import cl from './AdminUserDetail.module.scss';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
import { getProductServiceBaseUrl } from '@packages/shared/src/utils/api/productServiceUrl';
import { backendOriginForPort } from '@packages/shared/src/config/backendOrigin';
import Cookies from '@packages/shared/src/utils/cookies';
import Button from '@packages/shared/src/components/UI/Button/Button';
import ActionsMenu from '@packages/shared/src/components/UI/ActionsMenu/ActionsMenu';
import PopupEditUser from '@/components/PopupEditUser';
import OrderCard from '@/components/OrderCard';
import { adminUsersAction } from '@packages/shared/src/utils/constants/actionsMenu';
import type { UserDataType } from '@packages/shared/src/utils/types/userData.type';
import type { OrderDataType, OrderStatus } from '@packages/shared/src/utils/types/orderData.type';
import type { UserReviewItem, UserReviewsListResponse } from '@packages/shared/src/types/reviews.types';
import userIcon from '@packages/shared/src/assets/images/icons/userIcon.png';
import { api } from '@packages/shared/src/routes/api';

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

function renderStars(rating: number, styles: any) {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`${styles.star} ${i < rating ? styles.filled : ''}`}>★</span>
  ));
}

const AdminUserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<UserDataType | null>(null);
  const [orders, setOrders] = useState<OrderDataType[]>([]);
  const [savingOrderIds, setSavingOrderIds] = useState<Record<string, boolean>>({});
  const [reviews, setReviews] = useState<UserReviewItem[]>([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDataType | null>(null);
  const [deletedUser, setDeletedUser] = useState<UserDataType | null>(null);

  const cookies = useMemo(() => new Cookies(), []);

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

  useEffect(() => {
    if (!deletedUser) return;
    const cookies = new Cookies();
    fetch(`${backendOriginForPort(5004)}/fashion/admin/users/delete/${deletedUser.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${cookies.getCookie('token')}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.success === true) {
          navigate(`/${api}/admin/users`);
        }
      });
  }, [deletedUser, navigate]);

  const loadMoreReviews = () => {
    const nextPage = reviewPage + 1;
    setReviewPage(nextPage);
    fetchReviews({
      method: 'GET',
      url: `admin/reviews/by-user/${userId}?page=${nextPage}&limit=10`,
      baseUrl: getProductServiceBaseUrl(),
    });
  };

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

  const updateStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    setSavingOrderIds((prev) => ({ ...prev, [orderId]: true }));
    try {
      const res = await fetch(`${backendOriginForPort(5004)}/fashion/admin/orders/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${cookies.getCookie('token')}`,
        },
        body: JSON.stringify({ orderId, status }),
      });
      const payload = await res.json();
      if (!res.ok || payload?.success === false) {
        throw new Error(payload?.message || 'Не вдалося оновити статус');
      }
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    } catch (err) {
      console.error('[AdminUserDetail] update status error:', err);
    } finally {
      setSavingOrderIds((prev) => ({ ...prev, [orderId]: false }));
    }
  }, [cookies]);

  if (!user) {
    return <div className={cl.loading}>Завантаження…</div>;
  }

  return (
    <div className={cl.layout}>
      <div className={cl.topBar}>
        <button className={cl.backLink} onClick={() => navigate(-1)}>Назад до користувачів</button>
        <ActionsMenu
          actionList={adminUsersAction(user, setSelectedUser, setDeletedUser)}
          ref={menuRef}
          data={user}
        />
      </div>

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
              <OrderCard
                key={order.id}
                order={order}
                isSaving={Boolean(savingOrderIds[order.id])}
                onUpdateStatus={updateStatus}
              />
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
                  <Link
                    to={`/${api}/admin/products/${r.productId}`}
                    className={cl.reviewProductTag}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {r.productName}
                  </Link>
                  <span className={cl.reviewDate}>{formatRelativeTimeUk(r.createdAt)}</span>
                  <Button
                    variant="trash"
                    type="button"
                    text="Видалити"
                    disabled={deletingReviewId === r.id}
                    onClick={() => handleDeleteReview(r.id)}
                  />
                </div>
                {r.reviewTitle && <p className={cl.reviewTitle}>{r.reviewTitle}</p>}
                <p className={cl.reviewText}>{r.text}</p>
              </div>
            ))}
          </div>
        )}
        {hasMoreReviews && (
          <Button
            variant="submit-secondary"
            type="button"
            text={reviewsLoading ? 'Завантаження…' : 'Показати більше'}
            disabled={reviewsLoading}
            onClick={loadMoreReviews}
            className={cl.loadMoreBtn}
          />
        )}
      </div>

      {selectedUser && (
        <PopupEditUser
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSaved={() => fetchUsers({ method: 'GET', url: 'admin/users', port: 5004 })}
        />
      )}
    </div>
  );
};

export default AdminUserDetail;
