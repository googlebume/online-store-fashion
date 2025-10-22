import { ProductType } from "@packages/shared/src/utils/types/prosuctData.type";

type CartItem = ProductType & {
  quantity: number;
};

let cartItems: CartItem[] = [];
let listeners: (() => void)[] = [];

// Функція для підписки на зміни стану кошика
export const subscribeToCartChanges = (callback: () => void) => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(cb => cb !== callback);
  };
};

// Функція для сповіщення всіх підписників про зміни
const notifyListeners = () => {
  listeners.forEach(callback => callback());
};

// Додавання продукту до кошика
export const addToCart = (product: ProductType) => {
  console.log("До кошика додано:", product)
  const existingItemIndex = cartItems.findIndex(item => item.name === product.name);
  
  if (existingItemIndex >= 0) {
    // Якщо продукт вже є в кошику, збільшуємо кількість
    cartItems[existingItemIndex].quantity += 1;
  } else {
    // Інакше додаємо новий продукт з кількістю 1
    cartItems.push({
      ...product,
      quantity: 1,
    });
  }
  
  notifyListeners();
};

// Видалення продукту з кошика
export const removeFromCart = (productName: string) => {
  cartItems = cartItems.filter(item => item.name !== productName);
  notifyListeners();
};

// Зміна кількості продукту
export const updateQuantity = (productName: string, newQuantity: number) => {
  if (newQuantity < 1) return;
  
  const index = cartItems.findIndex(item => item.name === productName);
  if (index >= 0) {
    cartItems[index].quantity = newQuantity;
    notifyListeners();
  }
};

// Отримання всіх продуктів у кошику
export const getCartItems = () => {
  return [...cartItems];
};

// Розрахунок ціни для одного продукту з урахуванням знижки та кількості
export const calculateItemPrice = (item: CartItem) => {
  // Якщо є знижка, використовуємо ціну зі знижкою
  const unitPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;
  return unitPrice * item.quantity;
};

// Отримання загальної суми замовлення
export const getTotalPrice = () => {
  return cartItems.reduce((total, item) => {
    return total + calculateItemPrice(item);
  }, 0);
};

// Очищення кошика
export const clearCart = () => {
  cartItems = [];
  notifyListeners();
};