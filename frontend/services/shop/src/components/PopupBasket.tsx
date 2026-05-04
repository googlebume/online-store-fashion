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
import { trackAnalytics } from '@packages/shared/src/utils/analytics/trackAnalytics';
import { cartSummaryForAnalytics } from '@packages/shared/src/utils/analytics/ecommercePayload';

interface PopupBasketProps {
    setBasketOpenStatus: React.Dispatch<React.SetStateAction<boolean>>;
    basketOpenStatus: boolean;
}

const PopupBasket: React.FC<PopupBasketProps> = ({ setBasketOpenStatus, basketOpenStatus }) => {
    const [productsInCart, setProductsInCart] = useState<ProductType[]>(getCartItems());
    const [deliveryParams, setDeliveryParams] = useState({});

    const hasProducts = productsInCart.length > 0;

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

    useEffect(() => {
        if (!hasProducts) {
            return;
        }
        trackAnalytics({
            name: 'view_cart',
            payload: cartSummaryForAnalytics(getCartItems() as (ProductType & { quantity: number })[]),
        });
    }, [hasProducts]);

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

