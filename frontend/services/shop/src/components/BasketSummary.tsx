import React, { useEffect, useMemo, useRef, useState } from 'react';
import cl from '@shop/utils/styles/modules/BasketSummary.module.scss';
import { clearCart, getCartItems, getTotalPrice, subscribeToCartChanges } from '@shop/state/basketState';
import { cartSummaryForAnalytics } from '@packages/shared/src/utils/analytics/ecommercePayload';
import type { ProductType } from '@packages/shared/src/utils/types/prosuctData.type';
import Button from '@packages/shared/src/components/UI/Button/Button';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
import ErrorMassage from '@packages/shared/src/components/UI/ErrorMassage/ErrorMassage';
import { trackAnalytics } from '@packages/shared/src/utils/analytics/trackAnalytics';
import type { PromoPricingDto } from '@shop/utils/api/orderPromo.api';
import { trackPromoOrderCompleted } from '@packages/shared/src/utils/analytics/promoAnalytics';
import Cookies from '@packages/shared/src/utils/cookies';
import { api } from '@packages/shared/src/routes/api';

const cookies = new Cookies();

type BasketSummaryProps = {
    deliveryParams: Record<string, unknown>;
    promoPricing: PromoPricingDto | null;
    activePromoCode: string | null;
    promoCheckoutBlocked: boolean;
};

const BasketSummary: React.FC<BasketSummaryProps> = ({
    deliveryParams,
    promoPricing,
    activePromoCode,
    promoCheckoutBlocked,
}) => {
    const [cartTick, setCartTick] = useState(0);
    const [products, setProducts] = useState({})
    const [authError, setAuthError] = useState(false);
    const { fetchData, error, isLoading, response } = useFetch()

    const promoSnapshotRef = useRef<{ code: string | null; discount: number }>({
        code: null,
        discount: 0,
    });
    useEffect(() => {
        promoSnapshotRef.current = {
            code: activePromoCode,
            discount: promoPricing?.promoDiscountTotal ?? 0,
        };
    }, [activePromoCode, promoPricing]);
    useEffect(() => {
        return subscribeToCartChanges(() => setCartTick((t) => t + 1));
    }, []);

    const cartSubtotal = useMemo(() => getTotalPrice(), [cartTick]);

    const displayTotal = promoPricing ? promoPricing.total : cartSubtotal;
    const formattedPrice = displayTotal.toFixed(2);

    async function onOrder() {
        if (promoCheckoutBlocked) {
            return;
        }
        if (!cookies.getCookie('token')) {
            setAuthError(true);
            return;
        }
        setAuthError(false);
        const orderProducts = getCartItems()
        setProducts(orderProducts)

        deliveryParams.total = displayTotal
        console.log('[Shop][BasketSummary][onOrder] total:', deliveryParams.total)
        const order = {
            ...deliveryParams,
            ...(activePromoCode ? { promoCode: activePromoCode } : {}),
            items: orderProducts.map((item) => {
                return {
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                }
            }),
        }
        console.log('[Shop][BasketSummary][onOrder] payload:', order);

        const lineItems = getCartItems() as (ProductType & { quantity: number })[];
        trackAnalytics({
            name: 'begin_checkout',
            payload: cartSummaryForAnalytics(lineItems),
        });

        fetchData({
            method: 'POST',
            port: 5005,
            url: 'ordering/add',
            body: order,
        });
    }

    useEffect(() => {
        if (response?.success) {
            console.log('[Shop][BasketSummary] order success response:', response);
            const lineItems = getCartItems() as (ProductType & { quantity: number })[];
            const txId =
                (response as { orderId?: string; id?: string; data?: { id?: string } })?.orderId ??
                (response as { id?: string })?.id ??
                (response as { data?: { id?: string } })?.data?.id;
            const snap = promoSnapshotRef.current;
            if (snap.code) {
                trackPromoOrderCompleted({
                    promoCode: snap.code,
                    orderId: typeof txId === 'string' ? txId : undefined,
                    promoDiscountTotal: snap.discount,
                });
            }
            trackAnalytics({
                name: 'purchase',
                payload: {
                    ...cartSummaryForAnalytics(lineItems),
                    transaction_id: txId,
                    total: deliveryParams.total,
                    itemCount: lineItems.length,
                    ...(snap.code ? { promo_code: snap.code, promo_discount_total: snap.discount } : {}),
                },
            });
            clearCart()
        }
    }, [response])

    useEffect(() => {
        if (error) {
            console.error('[Shop][BasketSummary] order error:', error);
            console.error('[Shop][BasketSummary] deliveryParams snapshot:', deliveryParams);
            console.error('[Shop][BasketSummary] cart snapshot:', getCartItems());
            if (error.message === 'Не авторизований' || error.message?.toLowerCase().includes('unauthor')) {
                setAuthError(true);
            }
        }
    }, [error]);

    const showPromoBreakdown =
        promoPricing &&
        activePromoCode &&
        promoPricing.promoDiscountTotal > 0;

    return (
        <div className={cl.basketSummary}>
            <div className={cl.breakdown}>
                {showPromoBreakdown && (
                    <>
                        <div className={cl.breakdownRow}>
                            <span>Сума товарів</span>
                            <span>${promoPricing.subtotal.toFixed(2)}</span>
                        </div>
                        <div className={`${cl.breakdownRow} ${cl.breakdownDiscount}`}>
                            <span>Знижка ({activePromoCode})</span>
                            <span>−${promoPricing.promoDiscountTotal.toFixed(2)}</span>
                        </div>
                    </>
                )}
            </div>
            <div className={cl.display}>
                <div className={cl.displayDescription}>
                    <h3>{showPromoBreakdown ? 'До сплати:' : 'Сума:'}</h3>
                </div>
                <div className={cl.displayPrice}>
                    <span className={cl.price}>${formattedPrice}</span>
                </div>
            </div>
            <div>
                {authError && (
                    <ErrorMassage massage='Для оформлення замовлення необхідно увійти в акаунт' />
                )}
                {!authError && error && <ErrorMassage massage='Помилка оформлення замовлення'/>}
                <Button
                    variant='submit-primary'
                    text='Замовити'
                    disabled={promoCheckoutBlocked}
                    onClick={() => onOrder()}
                />
            </div>
        </div>
    );
};

export default BasketSummary;





