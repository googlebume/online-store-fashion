import { ProductType } from "@packages/shared/src/utils/types/prosuctData.type";
import { useState } from "react";

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


let allPrices: Record<string, number> = {};

export const exportAllPrices = (productName: string, updatedPrice: number) => {
    allPrices[productName] = updatedPrice;
    console.log('Updated Prices:', allPrices);
};


export const getAllPrices = () => {
    return allPrices;
};



// const [event, setEvent] = useState(0);

// export const setCounterEvent = (count?:number) => {
//     console.log('counter Event');
//     return setEvent(count);
// }

// export const counterEvent = () => {
//     return event;
// } 