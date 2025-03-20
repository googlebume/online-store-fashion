import { ProductType } from "@packages/shared/src/utils/types/prosuctData.type";

let productData: ProductType[] = [];

export const exportProductData = (data: ProductType) => {
    const isDuplicate = productData.some(product => product.name === data.name);

    if (!isDuplicate) {
        productData = [...productData, data];
        console.log('EXPORTED:', productData);
    } else {
        console.log('Product already in cart:', data.name);
    }
};


export const getAllProducts = () => {
    return productData;
};
