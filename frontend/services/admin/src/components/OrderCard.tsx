import React from 'react';
import cl from '@/utils/styles/modules/OrderCard.module.scss';
import type { OrderDataType, OrderStatus } from '@packages/shared/src/utils/types/orderData.type';

const ORDER_STATUSES: OrderStatus[] = [
  'Pending',
  'Processing',
  'Accepted',
  'Received',
  'Delivered',
  'Declined',
  'Canceled',
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  Pending: 'Очікує',
  Processing: 'Обробляється',
  Accepted: 'Прийнято',
  Received: 'Отримано',
  Delivered: 'Доставлено',
  Declined: 'Відхилено',
  Canceled: 'Скасовано',
};

type OrderCardProps = {
  order: OrderDataType;
  isSaving: boolean;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
};

const OrderCard: React.FC<OrderCardProps> = ({ order, isSaving, onUpdateStatus }) => {
  const itemTotal = order.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;
  const statusLabel = STATUS_LABELS[order.status as OrderStatus] || order.status;

  return (
    <article className={cl.card}>
      <header className={cl.header}>
        <div>
          <h3 className={cl.title}>Замовлення #{order.id.slice(0, 8)}</h3>
          <p className={cl.subTitle}>Створено: {new Date(order.createdAt).toLocaleString('uk-UA')}</p>
        </div>

        <div className={cl.statusControl}>
          <span className={cl.statusBadge}>{statusLabel}</span>
          <select
            className={cl.statusSelect}
            value={order.status}
            onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
            disabled={isSaving}
          >
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className={cl.metaGrid}>
        <div className={cl.metaItem}>
          <span className={cl.metaLabel}>Email</span>
          <span className={cl.metaValue}>{order.email}</span>
        </div>
        <div className={cl.metaItem}>
          <span className={cl.metaLabel}>Доставка</span>
          <span className={cl.metaValue}>{order.deliveryMethod}</span>
        </div>
        <div className={cl.metaItem}>
          <span className={cl.metaLabel}>Користувач</span>
          <span className={cl.metaValue}>{order.userId || 'Гість'}</span>
        </div>
        <div className={cl.metaItem}>
          <span className={cl.metaLabel}>Оновлено</span>
          <span className={cl.metaValue}>{new Date(order.updatedAt).toLocaleString('uk-UA')}</span>
        </div>
      </div>

      <div className={cl.addressBox}>
        <span className={cl.metaLabel}>Адреса</span>
        <p className={cl.addressValue}>{order.address}</p>
      </div>

      <div className={cl.itemsBox}>
        <div className={cl.itemsHeader}>
          <h4>Товари</h4>
          <span className={cl.itemsCount}>{order.items?.length || 0} шт.</span>
        </div>

        {order.items?.length ? (
          order.items.map((item) => (
            <div key={item.id} className={cl.itemRow}>
              <span className={cl.itemProduct}>{item.productId}</span>
              <span className={cl.itemCell}>x{item.quantity}</span>
              <span className={cl.itemCell}>{item.price.toFixed(2)} ₴</span>
              <span className={cl.itemTotal}>{(item.price * item.quantity).toFixed(2)} ₴</span>
            </div>
          ))
        ) : (
          <p className={cl.emptyItems}>Без товарів</p>
        )}
      </div>

      <footer className={cl.footer}>
        <p>
          <span>Сума товарів</span>
          <strong>{itemTotal.toFixed(2)} ₴</strong>
        </p>
        <p>
          <span>До сплати</span>
          <strong>{order.total.toFixed(2)} ₴</strong>
        </p>
      </footer>
    </article>
  );
};

export default OrderCard;
