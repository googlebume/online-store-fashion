import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@packages/shared/src/components/UI/Button/Button';
import InputData from '@packages/shared/src/components/UI/form-controls/InputData/InputData';
import ErrorMassage from '@packages/shared/src/components/UI/ErrorMassage/ErrorMassage';
import { currentUserActions, type RootState } from '@packages/shared/src/store';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
import Cookies from '@packages/shared/src/utils/cookies';
import type { OrderDataType, OrderStatus } from '@packages/shared/src/utils/types/orderData.type';
import type { UserDataType } from '@packages/shared/src/utils/types/userData.type';
import { api } from '@packages/shared/src/routes/api';
import cl from './UserProfilePage.module.scss';

type ProfileResponse = {
  success?: boolean;
  message?: string;
  userData?: UserDataType & { role?: string[] | string };
  token?: string;
};

type OrdersResponse = {
  success?: boolean;
  message?: string;
  data?: OrderDataType[];
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  Pending: 'Очікує',
  Processing: 'Обробляється',
  Accepted: 'Прийнято',
  Received: 'Отримано',
  Delivered: 'Доставлено',
  Declined: 'Відхилено',
  Canceled: 'Скасовано',
};

const RECEIPT_STATUSES = new Set<OrderStatus | string>(['Received', 'Delivered']);

const formatMoney = (value: number) => `${value.toFixed(2)} грн`;

const buildReceiptText = (order: OrderDataType) => {
  const lines: string[] = [
    `Чек замовлення #${order.id}`,
    `Дата: ${new Date(order.updatedAt || order.createdAt).toLocaleString('uk-UA')}`,
    `Email: ${order.email}`,
    `Статус: ${STATUS_LABELS[order.status as OrderStatus] || order.status}`,
    `Адреса: ${order.address}`,
    '',
    'Товари:',
  ];

  for (const item of order.items || []) {
    lines.push(`- ${item.productId} x${item.quantity} = ${formatMoney(item.price * item.quantity)}`);
  }

  lines.push('');
  lines.push(`Всього до сплати: ${formatMoney(order.total)}`);
  return lines.join('\n');
};

const downloadReceipt = (order: OrderDataType) => {
  const blob = new Blob([buildReceiptText(order)], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `receipt-${order.id}.txt`;
  anchor.click();
  URL.revokeObjectURL(url);
};

const extractOrders = (payload: unknown): OrderDataType[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as OrderDataType[];

  const typed = payload as OrdersResponse & { orders?: OrderDataType[]; data?: unknown };
  if (Array.isArray(typed.data)) return typed.data as OrderDataType[];

  const nested = typed.data as { data?: OrderDataType[] } | undefined;
  if (nested && Array.isArray(nested.data)) return nested.data;

  if (Array.isArray(typed.orders)) return typed.orders;
  return [];
};

const normalizeUserData = (user: (UserDataType & { role?: string[] | string }) | null | undefined): UserDataType | null => {
  if (!user) return null;

  return {
    ...user,
    role: Array.isArray(user.role) ? user.role : user.role ? [user.role] : [],
  };
};

const UserProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const cookies = useMemo(() => new Cookies(), []);
  const currentUser = useSelector((state: RootState) => state.currentUser.currentUser);

  const [profile, setProfile] = useState<UserDataType | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const profileRequest = useFetch<never, ProfileResponse>();
  const updateRequest = useFetch<{ name?: string; email?: string; password?: string }, ProfileResponse>();
  const ordersRequest = useFetch<never, OrdersResponse>();

  useEffect(() => {
    const token = cookies.getCookie('token');
    if (!token) {
      navigate(`/${api}/register`);
      return;
    }

    profileRequest.fetchData({
      method: 'GET',
      port: 4004,
      url: 'user-profile/me',
    });

    ordersRequest.fetchData({
      method: 'GET',
      port: 4006,
      url: 'ordering/my',
    });
  }, []);

  useEffect(() => {
    if (!profileRequest.response?.userData) return;
    const user = normalizeUserData(profileRequest.response.userData);
    if (!user) return;
    setProfile(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
    });
    dispatch(currentUserActions.setCurrentUser(user));
  }, [profileRequest.response, dispatch]);

  useEffect(() => {
    if (!updateRequest.response?.userData) return;
    const user = normalizeUserData(updateRequest.response.userData);
    if (!user) return;
    setProfile(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
    });
    dispatch(currentUserActions.setCurrentUser(user));

    if (updateRequest.response.token) {
      cookies.setCookie({
        name: 'token',
        data: updateRequest.response.token,
        path: `/${api}`,
      });
    }
  }, [updateRequest.response, dispatch, cookies]);

  useEffect(() => {
    if (!profile?.id || routeId) return;
    navigate(`/${api}/user-profile/${profile.id}`, { replace: true });
  }, [profile?.id, routeId, navigate]);

  const orders = extractOrders(ordersRequest.response);

  const onFieldInput = (field: 'name' | 'email' | 'password', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onSaveProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile) return;

    const payload: { name?: string; email?: string; password?: string } = {};
    if (formData.name.trim() && formData.name.trim() !== profile.name) payload.name = formData.name.trim();
    if (formData.email.trim() && formData.email.trim() !== profile.email) payload.email = formData.email.trim();
    if (formData.password.trim()) payload.password = formData.password.trim();

    if (!payload.name && !payload.email && !payload.password) return;

    updateRequest.fetchData({
      method: 'POST',
      port: 4004,
      url: 'user-profile/me',
      body: payload,
    });
  };

  return (
    <section className={cl.page}>
      <header className={cl.header}>
        <h1 className={cl.title}>Профіль користувача</h1>
        {profile ? (
          <p className={cl.subtitle}>
            ID: <span>{profile.id}</span>
          </p>
        ) : null}
      </header>

      {(profileRequest.error || updateRequest.error) && (
        <ErrorMassage
          massage={
            profileRequest.error?.message ||
            updateRequest.error?.message ||
            'Не вдалося завантажити дані профілю'
          }
        />
      )}

      <div className={cl.grid}>
        <article className={cl.card}>
          <h2>Мої дані</h2>
          {profileRequest.isLoading && !profile ? (
            <p className={cl.muted}>Завантаження профілю...</p>
          ) : (
            <ul className={cl.infoList}>
              <li>
                <strong>Ім&apos;я:</strong> {profile?.name || currentUser?.name || '-'}
              </li>
              <li>
                <strong>Email:</strong> {profile?.email || currentUser?.email || '-'}
              </li>
              <li>
                <strong>Роль:</strong> {(profile?.role || currentUser?.role || []).join(', ') || '-'}
              </li>
              <li>
                <strong>Створено:</strong>{' '}
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleString('uk-UA')
                  : '-'}
              </li>
            </ul>
          )}
        </article>

        <article className={cl.card}>
          <h2>Редагувати профіль</h2>
          <form onSubmit={onSaveProfile} className={cl.form}>
            <InputData
              type="text"
              id="profile-name"
              label="Ім'я"
              placeholder="Ваше ім'я"
              value={formData.name}
              onInput={(value) => onFieldInput('name', value)}
            />
            <InputData
              type="email"
              id="profile-email"
              label="Email"
              placeholder="name@email.com"
              value={formData.email}
              onInput={(value) => onFieldInput('email', value)}
            />
            <InputData
              type="password"
              id="profile-password"
              label="Новий пароль"
              placeholder="Не менше 8 символів"
              value={formData.password}
              onInput={(value) => onFieldInput('password', value)}
            />
            <Button
              text={updateRequest.isLoading ? 'Збереження...' : 'Зберегти зміни'}
              type="submit"
              disabled={updateRequest.isLoading}
            />
          </form>
        </article>
      </div>

      <article className={cl.ordersCard}>
        <div className={cl.ordersHeader}>
          <h2>Мої замовлення</h2>
          <span>{orders.length}</span>
        </div>

        {ordersRequest.isLoading ? (
          <p className={cl.muted}>Завантаження замовлень...</p>
        ) : null}

        {ordersRequest.error ? <ErrorMassage massage={ordersRequest.error.message} /> : null}

        {!ordersRequest.isLoading && !orders.length ? (
          <p className={cl.muted}>У вас поки що немає замовлень.</p>
        ) : null}

        <div className={cl.ordersList}>
          {orders.map((order) => (
            <article key={order.id} className={cl.orderItem}>
              <div className={cl.orderTop}>
                <div>
                  <h3>Замовлення #{order.id.slice(0, 8)}</h3>
                  <p>{new Date(order.createdAt).toLocaleString('uk-UA')}</p>
                </div>
                <span className={cl.status}>
                  {STATUS_LABELS[order.status as OrderStatus] || order.status}
                </span>
              </div>

              <div className={cl.orderMeta}>
                <p>
                  <strong>Доставка:</strong> {order.deliveryMethod}
                </p>
                <p>
                  <strong>Адреса:</strong> {order.address}
                </p>
                <p>
                  <strong>Сума:</strong> {formatMoney(order.total)}
                </p>
              </div>

              <div className={cl.items}>
                {(order.items || []).map((item) => (
                  <div key={item.id} className={cl.itemRow}>
                    <span>{item.productId}</span>
                    <span>x{item.quantity}</span>
                    <span>{formatMoney(item.price)}</span>
                    <span>{formatMoney(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {RECEIPT_STATUSES.has(order.status) ? (
                <div className={cl.receipt}>
                  <p>Замовлення вже отримано. Доступний чек.</p>
                  <Button
                    variant="submit-secondary"
                    text="Завантажити чек"
                    type="button"
                    onClick={() => downloadReceipt(order)}
                  />
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </article>
    </section>
  );
};

export default UserProfilePage;
