import React, { useEffect, useMemo, useState } from 'react';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
import type { OrderDataType, OrderStatus } from '@packages/shared/src/utils/types/orderData.type';
import Cookies from '@packages/shared/src/utils/cookies';
import OrderCard from '@/components/OrderCard';
import cl from './AdminOrders.module.scss';
import { backendOriginForPort } from '@packages/shared/src/config/backendOrigin';

type UnknownApiResponse = any;

const extractOrders = (payload: UnknownApiResponse): OrderDataType[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;

  const directData = payload?.data;
  if (Array.isArray(directData)) return directData;

  const nestedData = payload?.data?.data;
  if (Array.isArray(nestedData)) return nestedData;

  const ordersField = payload?.orders;
  if (Array.isArray(ordersField)) return ordersField;

  return [];
};

const AdminOrders = () => {
  const { response, fetchData, isLoading, error } = useFetch<null, UnknownApiResponse>();
  const [orders, setOrders] = useState<OrderDataType[]>([]);
  const [savingOrderIds, setSavingOrderIds] = useState<Record<string, boolean>>({});
  const [loadError, setLoadError] = useState<string | null>(null);
  const cookies = useMemo(() => new Cookies(), []);

  useEffect(() => {
    fetchData({
      method: 'GET',
      url: 'admin/orders',
      port: 5004,
    });
  }, []);

  useEffect(() => {
    if (!response) return;

    const parsedOrders = extractOrders(response);
    setOrders(parsedOrders);
    setLoadError(null);

    console.log('[AdminOrders] raw response:', response);
    console.log('[AdminOrders] parsed orders count:', parsedOrders.length);
  }, [response]);

  useEffect(() => {
    if (!error) return;
    setLoadError(error.message || 'Не вдалося завантажити замовлення');
    console.error('[AdminOrders] load error:', error);
  }, [error]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
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
        throw new Error(payload?.message || 'Не вдалося оновити статус замовлення');
      }

      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)));
    } catch (statusError) {
      console.error('[AdminOrders] update status error:', statusError);
    } finally {
      setSavingOrderIds((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  if (isLoading && orders.length === 0) {
    return (
      <section className={cl.layout}>
        <div className={cl.toolbar}>
          <h2 className={cl.title}>Замовлення</h2>
        </div>
        <div className={cl.grid}>
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className={cl.skeletonCard}>
              <div className={cl.skeletonLine} style={{ height: 24, width: '60%' }} />
              <div className={cl.skeletonLine} style={{ height: 14, width: '40%' }} />
              <div className={cl.skeletonLine} style={{ height: 80 }} />
              <div className={cl.skeletonLine} style={{ height: 60 }} />
              <div className={cl.skeletonLine} style={{ height: 40, width: '50%', marginTop: 8 }} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (loadError) {
    return <div className={cl.empty}>Помилка: {loadError}</div>;
  }

  if (orders.length === 0) {
    return <div className={cl.empty}>Немає замовлень</div>;
  }

  return (
    <section className={cl.layout}>
      <div className={cl.toolbar}>
        <h2 className={cl.title}>Замовлення</h2>
        <span className={cl.counter}>{orders.length}</span>
      </div>
      <div className={cl.grid}>
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            isSaving={Boolean(savingOrderIds[order.id])}
            onUpdateStatus={updateStatus}
          />
        ))}
      </div>
    </section>
  );
};

export default AdminOrders;
