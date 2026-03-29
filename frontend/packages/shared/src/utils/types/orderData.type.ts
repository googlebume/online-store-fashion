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
  price: number;
}

export interface OrderDataType {
  id: string;
  userId?: string | null;
  total: number;
  deliveryMethod: DeliveryMethod | string;
  address: string;
  email: string;
  status: OrderStatus | string;
  createdAt: string;
  updatedAt: string;
  items: OrderItemDataType[];
}
