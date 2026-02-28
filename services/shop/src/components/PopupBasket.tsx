import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom";
import cl from "@shop/utils/styles/modules/PopupBasket.module.scss";
import ClosePopupCross from '@packages/shared/src/components/UI/ClosePopupCross/ClosePopupCross';
import BasketOverview from './BasketOverview';
import BasketDelivery from './BasketDelivery';
import BasketSummary from './BasketSummary';
import EmptyBasket from './EmptyBasket';
import { getCartItems, subscribeToCartChanges } from '../state/basketState';
import {ProductType} from '@packages/shared/src/utils/types/prosuctData.type'

interface PopupBasketProps {
    setBasketOpenStatus: React.Dispatch<React.SetStateAction<boolean>>;
    basketOpenStatus: boolean;
}

const PopupBasket: React.FC<PopupBasketProps> = ({ setBasketOpenStatus, basketOpenStatus }) => {
    const [productsInCart, setProductsInCart] = useState<ProductType[]>(getCartItems());
    const [deliveryParams, setDeliveryParams] = useState({})

    useEffect(() => {
        document.body.style.overflow = "hidden";

        const unsubscribe = subscribeToCartChanges(() => {
            setProductsInCart(getCartItems());
        });

        setProductsInCart(getCartItems());

        return () => {
            document.body.style.overflow = "";
            unsubscribe();
        };
    }, []);

    const hasProducts = productsInCart.length > 0;

    return ReactDOM.createPortal(
        <div
            className={cl.modalOverlay}
            onClick={() => setBasketOpenStatus(false)}
        >
            {hasProducts ? (
                <div
                    className={cl.modalContent}
                    onClick={(e) => e.stopPropagation()}
                >
                    <ClosePopupCross setOpenStatus={setBasketOpenStatus} />
                    <>
                        <BasketOverview />
                        <BasketDelivery setDeliveryParams={setDeliveryParams}/>
                        <BasketSummary deliveryParams={deliveryParams}/>
                    </>
                </div>
            ) : (
                <div
                    className={cl.basket}
                    onClick={(e) => e.stopPropagation()}
                >
                    <ClosePopupCross setOpenStatus={setBasketOpenStatus} />
                    <EmptyBasket />
                </div>
            )}
        </div>,
        document.getElementById("modal-root")!
    );
};

export default PopupBasket;

