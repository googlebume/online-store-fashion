import { ProductType } from "@packages/shared/src/utils/types/prosuctData.type";

let productData: ProductType[] = [];
let renderCallback: (() => void) | null = null;
export const setRenderCallback = (callback: () => void) => {
    renderCallback = callback; // Збереження функції примусового ререндеру
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

let deletedProducts:string[] = []
export const setDeletedProducts = (productName: string) => {
    deletedProducts = [...deletedProducts, productName];
    productData = productData.filter(product => product.name !== productName);
    renderCallback?.();
    console.log('Deleted product added:', productName);
};







let allPrices: Record<string, number> = {};

export const exportAllPrices = (productName: string, updatedPrice: number) => {
    allPrices[productName] = updatedPrice;
    console.log('Updated Prices:', allPrices);
};

export const getAllPrices = () => {
    return allPrices;
};