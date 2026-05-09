import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import type { PromoBasketEvent } from '@shop/types/promoBasket.events';
import type { PromoPricingDto } from '@shop/utils/api/orderPromo.api';
import { validatePromoCode } from '@shop/utils/api/orderPromo.api';

interface PopupBasketProps {
    setBasketOpenStatus: React.Dispatch<React.SetStateAction<boolean>>;
    basketOpenStatus: boolean;
}

const PopupBasket: React.FC<PopupBasketProps> = ({ setBasketOpenStatus, basketOpenStatus }) => {
    const [productsInCart, setProductsInCart] = useState<ProductType[]>(getCartItems());
    const [deliveryParams, setDeliveryParams] = useState({});
    const hasProducts = productsInCart.length > 0;

    const [promoPricing, setPromoPricing] = useState<PromoPricingDto | null>(null);
    const [activePromoCode, setActivePromoCode] = useState<string | null>(null);
    const [promoFieldError, setPromoFieldError] = useState<string | null>(null);
    const [promoValidating, setPromoValidating] = useState(false);
    const [couponDraft, setCouponDraft] = useState('');
    const [couponSectionOpen, setCouponSectionOpen] = useState(false);

    const activePromoCodeRef = useRef<string | null>(null);
    useEffect(() => {
        activePromoCodeRef.current = activePromoCode;
    }, [activePromoCode]);

    const [cartTick, setCartTick] = useState(0);
    useEffect(() => subscribeToCartChanges(() => setCartTick((t) => t + 1)), []);

    const handlePromoEvent = useCallback((ev: PromoBasketEvent) => {
        switch (ev.type) {
            case 'clear':
                setCouponDraft('');
                setPromoPricing(null);
                setActivePromoCode(null);
                setPromoFieldError(null);
                setPromoValidating(false);
                break;
            case 'clear_field_error':
                setPromoFieldError(null);
                break;
            case 'validating':
                setPromoValidating(true);
                setPromoFieldError(null);
                break;
            case 'valid':
                setCouponDraft(ev.code);
                setPromoValidating(false);
                setPromoPricing(ev.pricing);
                setActivePromoCode(ev.code);
                setPromoFieldError(null);
                break;
            case 'invalid':
                setPromoValidating(false);
                setPromoPricing(null);
                setActivePromoCode(null);
                setPromoFieldError(ev.message);
                break;
        }
    }, []);

    useEffect(() => {
        if (!hasProducts) {
            setCouponDraft('');
            setCouponSectionOpen(false);
            setPromoPricing(null);
            setActivePromoCode(null);
            setPromoFieldError(null);
            setPromoValidating(false);
        }
    }, [hasProducts]);

    const promoCheckoutBlocked = useMemo(() => {
        if (!couponSectionOpen) {
            return false;
        }
        const t = couponDraft.trim();
        if (!t.length) {
            return false;
        }
        if (promoValidating) {
            return true;
        }
        if (promoFieldError) {
            return true;
        }
        if (!promoPricing || !activePromoCode) {
            return true;
        }
        return t.toUpperCase() !== activePromoCode.trim().toUpperCase();
    }, [
        couponSectionOpen,
        couponDraft,
        promoValidating,
        promoFieldError,
        promoPricing,
        activePromoCode,
    ]);

    useEffect(() => {
        const code = activePromoCodeRef.current;
        if (!code || !hasProducts) {
            return;
        }
        let cancelled = false;
        setPromoValidating(true);
        validatePromoCode(code)
            .then((pricing) => {
                if (cancelled) return;
                setPromoPricing(pricing);
                setPromoFieldError(null);
            })
            .catch((err: Error) => {
                if (cancelled) return;
                setPromoPricing(null);
                setActivePromoCode(null);
                setPromoFieldError(err.message || 'Промокід більше не діє для цього кошика');
            })
            .finally(() => {
                if (!cancelled) setPromoValidating(false);
            });
        return () => {
            cancelled = true;
        };
    }, [cartTick, hasProducts]);

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
                        <BasketDelivery
                            setDeliveryParams={setDeliveryParams}
                            onPromoEvent={handlePromoEvent}
                            activePromoCode={activePromoCode}
                            promoFieldError={promoFieldError}
                            promoValidating={promoValidating}
                            couponDraft={couponDraft}
                            setCouponDraft={setCouponDraft}
                            couponSectionOpen={couponSectionOpen}
                            setCouponSectionOpen={setCouponSectionOpen}
                        />
                        <BasketSummary
                            deliveryParams={deliveryParams}
                            promoPricing={promoPricing}
                            activePromoCode={activePromoCode}
                            promoCheckoutBlocked={promoCheckoutBlocked}
                        />
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

