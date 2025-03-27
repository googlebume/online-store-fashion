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


import { ProductType } from "@packages/shared/src/utils/types/prosuctData.type";

let productData: ProductType[] = [];
let renderCallback: (() => void) | null = null;
let deletedProducts: string[] = [];
let allPrices: Record<string, number> = {};

export const setRenderCallback = (callback: () => void) => {
    renderCallback = callback;
};

export const exportProductData = (data: ProductType) => {
    const isDuplicate = productData.some(product => product.name === data.name);
    const isDeleted = deletedProducts.includes(data.name);

    if (!isDuplicate && !isDeleted) {
        productData = [...productData, data];
        renderCallback?.();
        console.log('EXPORTED:', productData);
    } else {
        console.log(isDeleted ? `Cannot add, ${data.name} was deleted.` : `Product already in cart: ${data.name}`);
    }
};

export const getAllProducts = () => {
    return productData;
};

export const setDeletedProducts = async (productName: string) => {
    // Додаємо назву до видалених продуктів
    deletedProducts = [...deletedProducts, productName];
    
    // Видаляємо продукт з масиву
    productData = productData.filter(product => product.name !== productName);
    
    // Асинхронно оновлюємо ціну з мінімальним навантаженням на рендеринг
    await exportAllPrices(productName, 0);
    
    console.log('Deleted product added:', productName);
};

export const exportAllPrices = (productName: string, updatedPrice: number) => {
    // Використовуємо Promise для м'якого оновлення
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            // Оновлюємо ціну
            allPrices[productName] = updatedPrice;
            
            // Викликаємо рендер
            renderCallback?.();
            
            console.log('Updated Prices:', allPrices);
            resolve();
        }, 0);
    });
};

export const getAllPrices = () => {
    return allPrices;
};

export const getDeletedProducts = () => {
    return deletedProducts;
};