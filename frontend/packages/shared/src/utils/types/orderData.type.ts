export type OrderStatus =
  | 'Pending'
  | 'Delivered'
  | 'Declined'
  | 'Canceled'
  | 'Received'
  | 'Processing'
  | 'Accepted';

export type DeliveryMethod = 'Courier' | 'Pickup';

export interface OrderItemDataType {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  /** Фінальна ціна за одиницю після знижок (рядка та промокоду). */
  price: number;
  originalPrice?: number;
  discountAmount?: number;
}

export interface OrderDataType {
  id: string;
  userId?: string | null;
  total: number;
  /** Сума товарів до промокоду (якщо була застосована знижка промокоду). */
  subtotal?: number;
  promoDiscountTotal?: number;
  promoCode?: string | null;
  promoCodeId?: string | null;
  deliveryMethod: DeliveryMethod | string;
  address: string;
  email: string;
  status: OrderStatus | string;
  createdAt: string;
  updatedAt: string;
  items: OrderItemDataType[];
}
