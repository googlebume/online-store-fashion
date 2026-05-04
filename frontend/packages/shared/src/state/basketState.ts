import type { ProductType } from '../utils/types/prosuctData.type';
import { trackAnalytics } from '../utils/analytics/trackAnalytics';
import {
  ECOMMERCE_CURRENCY,
  lineValue,
  toGa4Item,
} from '../utils/analytics/ecommercePayload';

type CartItem = ProductType & {
  quantity: number;
};

export const BASKET_STORAGE_KEY = 'fashion_store_cart_v1';

const BASKET_UPDATED_EVENT = 'fashion-basket-updated';

function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(BASKET_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as CartItem[];
  } catch {
    return [];
  }
}

function persistCart(): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(cartItems));
    window.dispatchEvent(new CustomEvent(BASKET_UPDATED_EVENT));
  } catch (e) {
    console.warn('[basketState] Не вдалося зберегти кошик у localStorage', e);
  }
}

let cartItems: CartItem[] =
  typeof window !== 'undefined' ? loadCartFromStorage() : [];
const listeners: Array<() => void> = [];

const notifyListeners = () => {
  listeners.forEach(cb => cb());
};

/** Перечитати кошик з localStorage (інший бандл MFE / інша вкладка). */
export const syncCartFromStorage = (): void => {
  cartItems = loadCartFromStorage();
  notifyListeners();
};

function attachCrossBundleSync(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('storage', (e: StorageEvent) => {
    if (e.key === BASKET_STORAGE_KEY) {
      syncCartFromStorage();
    }
  });

  window.addEventListener(BASKET_UPDATED_EVENT, () => {
    syncCartFromStorage();
  });
}

attachCrossBundleSync();

export const subscribeToCartChanges = (callback: () => void) => {
  listeners.push(callback);
  return () => {
    const i = listeners.indexOf(callback);
    if (i >= 0) listeners.splice(i, 1);
  };
};

/** Додати товар; `quantity` — скільки одиниць додати за раз. */
export const addToCart = (product: ProductType, quantity: number = 1) => {
  const q = Math.max(1, Math.floor(quantity));
  const existingItemIndex = cartItems.findIndex(item => item.name === product.name);

  if (existingItemIndex >= 0) {
    cartItems[existingItemIndex].quantity += q;
  } else {
    cartItems.push({
      ...product,
      quantity: q,
    });
  }

  persistCart();
  notifyListeners();
  trackAnalytics({
    name: 'add_to_cart',
    productId: product.id,
    payload: {
      currency: ECOMMERCE_CURRENCY,
      value: lineValue(product, q),
      ...toGa4Item(product, q),
    },
  });
};

export const removeFromCart = (productName: string) => {
  const removed = cartItems.find((item) => item.name === productName);
  cartItems = cartItems.filter(item => item.name !== productName);
  persistCart();
  notifyListeners();
  if (removed) {
    trackAnalytics({
      name: 'remove_from_cart',
      productId: removed.id,
      payload: {
        currency: ECOMMERCE_CURRENCY,
        value: lineValue(removed, removed.quantity),
        ...toGa4Item(removed, removed.quantity),
      },
    });
  }
};

export const updateQuantity = (productName: string, newQuantity: number) => {
  if (newQuantity < 1) return;

  const index = cartItems.findIndex(item => item.name === productName);
  if (index >= 0) {
    const prevQty = cartItems[index].quantity;
    cartItems[index].quantity = newQuantity;
    persistCart();
    notifyListeners();
    const row = cartItems[index];
    trackAnalytics({
      name: 'cart_quantity_updated',
      productId: row.id,
      payload: {
        currency: ECOMMERCE_CURRENCY,
        value: lineValue(row, newQuantity),
        previousQuantity: prevQty,
        quantity: newQuantity,
        ...toGa4Item(row, newQuantity),
      },
    });
  }
};

export const getCartItems = () => [...cartItems];

export const calculateItemPrice = (item: CartItem) => {
  const unitPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;
  return unitPrice * item.quantity;
};

export const getTotalPrice = () => {
  return cartItems.reduce((total, item) => total + calculateItemPrice(item), 0);
};

export const clearCart = () => {
  cartItems = [];
  persistCart();
  notifyListeners();
};
