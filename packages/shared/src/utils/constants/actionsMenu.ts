import React from "react";
import { ProductType } from "../../utils/types/prosuctData.type";

export type MenuActionType = {
    name: string;
    action?: (data?: any) => void;
}

export const adminProductsAction = (
    productData: ProductType,
    setSelectedProduct: (data: ProductType) => void,
    setDeletedProduct: (data: ProductType) => void): MenuActionType[] => {
    return [
        {
            name: 'Змінити',
            action: () => {
                setSelectedProduct(productData);
            }
        },
        {
            name: 'Видалити',
            action: () => {
                setDeletedProduct(productData);
            }
        },
    ];
};