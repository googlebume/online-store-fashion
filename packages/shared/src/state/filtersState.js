let updatedCategories = [];
let categoryListeners = [];
let colorListeners = [];

export const setUpdatedCategories = (newCategories) => {
    updatedCategories = [...newCategories];
    console.log("✅ Категорії оновлені:", ...updatedCategories);
    
    // Оповіщаємо всі підписані компоненти про оновлення
    categoryListeners.forEach((callback) => callback(updatedCategories));
};


export const getUpdatedCategories = () => updatedCategories;

export const subscribeToCategories = (callback) => {
    categoryListeners.push(callback);
    return () => {
        categoryListeners = categoryListeners.filter((cb) => cb !== callback);
    };
};


let updatedColors = [];
export const setUpdatedColors = (newColors) => {
    updatedColors = [...newColors];
    console.log("✅ Кольори оновлені:", ...updatedColors);
    
    // Оповіщаємо всі підписані компоненти про оновлення
    colorListeners.forEach((callback) => callback(updatedColors));
};


export const getUpdatedColors = () => updatedColors;

export const subscribeToColors = (callback) => {
    colorListeners.push(callback);
    return () => {
        colorListeners = colorListeners.filter((cb) => cb !== callback);
    };
};

