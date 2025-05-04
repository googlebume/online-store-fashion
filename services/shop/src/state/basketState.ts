// import { ProductType } from "@packages/shared/src/utils/types/prosuctData.type";

// let productData: ProductType[] = [];
// let renderCallback: (() => void) | null = null;
// export const setRenderCallback = (callback: () => void) => {
//     renderCallback = callback;
// };

// export const exportProductData = (data: ProductType) => {
//     const isDuplicate = productData.some(product => product.name === data.name);
//     const isDeleted = deletedProducts.includes(data.name);

//     if (!isDuplicate && !isDeleted) {
//         productData = [...productData, data];
//         renderCallback?.();
//         console.log('EXPORTED:', productData);
//     } else {
//         console.log(isDeleted ? `Cannot add, ${data.name} was deleted.` : `Product already in cart: ${data.name}`);
//     }
// };

// export const getAllProducts = () => {
//     return productData;
// };

// let deletedProducts:string[] = []
// export const setDeletedProducts = (productName: string) => {
//     deletedProducts = [...deletedProducts, productName];
//     productData = productData.filter(product => product.name !== productName);
//     exportAllPrices(productName, 0);
//     console.log('Deleted product added:', productName);
// };







// let allPrices: Record<string, number> = {};

// export const exportAllPrices = (productName: string, updatedPrice: number) => {
//     allPrices[productName] = updatedPrice;
//     console.log('Updated Prices:', allPrices);
//     renderCallback?.();
// };

// export const getAllPrices = () => {
//     return allPrices;
// };





// import { ProductType } from "@packages/shared/src/utils/types/prosuctData.type";

// let productData: ProductType[] = [];
// let renderCallback: (() => void) | null = null;
// let deletedProducts: string[] = [];
// let allPrices: Record<string, number> = {};

// export const setRenderCallback = (callback: () => void) => {
//     renderCallback = callback;
// };

// export const exportProductData = (data: ProductType) => {
//     const isDuplicate = productData.some(product => product.name === data.name);
//     const isDeleted = deletedProducts.includes(data.name);

//     if (!isDuplicate && !isDeleted) {
//         productData = [...productData, data];
//         renderCallback?.();
//         console.log('EXPORTED:', productData);
//     } else {
//         console.log(isDeleted ? `Cannot add, ${data.name} was deleted.` : `Product already in cart: ${data.name}`);
//     }
// };

// export const getAllProducts = () => {
//     return productData;
// };

// export const setDeletedProducts = async (productName: string) => {
//     // Додаємо назву до видалених продуктів
//     deletedProducts = [...deletedProducts, productName];
    
//     // Видаляємо продукт з масиву
//     productData = productData.filter(product => product.name !== productName);
    
//     // Асинхронно оновлюємо ціну з мінімальним навантаженням на рендеринг
//     await exportAllPrices(productName, 0);
    
//     console.log('Deleted product added:', productName);
// };

// export const exportAllPrices = (productName: string, updatedPrice: number) => {
//     // Використовуємо Promise для м'якого оновлення
//     return new Promise<void>((resolve) => {
//         setTimeout(() => {
//             // Оновлюємо ціну
//             allPrices[productName] = updatedPrice;
            
//             // Викликаємо рендер
//             renderCallback?.();
            
//             console.log('Updated Prices:', allPrices);
//             resolve();
//         }, 0);
//     });
// };

// export const getAllPrices = () => {
//     return allPrices;
// };

// export const getDeletedProducts = () => {
//     return deletedProducts;
// };

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