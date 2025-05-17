// let products = [];
// export const exportProducts = (data) => {
//     products = data;
// };
// export const getAllProducts = () => {return products};



// let filteredProducts = [];
// export const exportFilteredProducts = (FilteredData) => {
//     filteredProducts = FilteredData;
// }
// export const getFilteredProducts = () => {return filteredProducts };


let products = [];

export const exportProducts = (data) => {
    products = [...data];
    console.log("✅ Дані збережено в `products`:", products);
};

export const getAllProducts = () => {
    console.log("📢 Отримання всіх продуктів:", products);
    return products;
};




let filteredProducts = [];
let listeners = [];

export const exportFilteredProducts = (FilteredData) => {
    filteredProducts = [...FilteredData];
    console.log("✅ Фільтровані продукти збережено:", filteredProducts);
    
    // Оповіщаємо всі підписані компоненти про зміну
    listeners.forEach((callback) => callback(filteredProducts));
};

export const getFilteredProducts = () => filteredProducts;

// Функція для підписки на зміни фільтрованих продуктів
export const subscribeToFilteredProducts = (callback) => {
    listeners.push(callback);
    return () => {
        listeners = listeners.filter((cb) => cb !== callback);
    };
};
