import React from "react";
import { ProductType } from "../../utils/types/prosuctData.type";
import { UserDataType } from "../types/userData.type";

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

export const adminUsersAction = (
    userData: UserDataType,
    setSelectedUser: (data: UserDataType) => void,
    setDeletedUser: (data: UserDataType) => void
): MenuActionType[] => {
    return [
        {
            name: "Видалити",
            action: () => {
                setDeletedUser(userData);
            }
        }
    ];
};


