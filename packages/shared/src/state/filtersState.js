// let updatedCategories = [];

// export const setUpdatedCategories = (categories) => {
//     updatedCategories = categories;
// };

// export const getUpdatedCategories = () => updatedCategories;


// import { useState } from "react";

// let updatedCategories = [];

// export const setUpdatedCategories = (newCategories) => {
//     updatedCategories = newCategories;
// };

// export const getUpdatedCategories = () => {console.log("📢 Отримані категорії:", updatedCategories); return updatedCategories};


let updatedCategories = [];
let listeners = [];

export const setUpdatedCategories = (newCategories) => {
    updatedCategories = [...newCategories];
    console.log("✅ Категорії оновлені:", ...updatedCategories);
    
    // Оповіщаємо всі підписані компоненти про оновлення
    listeners.forEach((callback) => callback(updatedCategories));
};

export const getUpdatedCategories = () => updatedCategories;

export const subscribeToCategories = (callback) => {
    listeners.push(callback);
    return () => {
        listeners = listeners.filter((cb) => cb !== callback);
    };
};

