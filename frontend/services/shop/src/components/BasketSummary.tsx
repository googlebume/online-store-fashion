import React, { useEffect, useState } from 'react';
import cl from '@shop/utils/styles/modules/BasketSummary.module.scss';
import { clearCart, getCartItems, getTotalPrice, subscribeToCartChanges } from '@shop/state/basketState';
import { cartSummaryForAnalytics } from '@packages/shared/src/utils/analytics/ecommercePayload';
import type { ProductType } from '@packages/shared/src/utils/types/prosuctData.type';
import Button from '@packages/shared/src/components/UI/Button/Button';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
import ErrorMassage from '@packages/shared/src/components/UI/ErrorMassage/ErrorMassage';
import { trackAnalytics } from '@packages/shared/src/utils/analytics/trackAnalytics';

const BasketSummary: React.FC<{ deliveryParams: any }> = ({ deliveryParams }) => {
    const [finalPrice, setFinalPrice] = useState(getTotalPrice());
    const [products, setProducts] = useState({})
    const { fetchData, error, isLoading, response } = useFetch()
    useEffect(() => {
        const unsubscribe = subscribeToCartChanges(() => {
            setFinalPrice(getTotalPrice());
        });

        return () => unsubscribe();
    }, []);


    const formattedPrice = finalPrice.toFixed(2);

    async function onOrder() {
        const orderProducts = getCartItems()
        setProducts(orderProducts)

        deliveryParams.total = +formattedPrice
        console.log('[Shop][BasketSummary][onOrder] total:', deliveryParams.total)
        const order = {
            ...deliveryParams,
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
            port: 4006,
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
            trackAnalytics({
                name: 'purchase',
                payload: {
                    ...cartSummaryForAnalytics(lineItems),
                    transaction_id: txId,
                    total: deliveryParams.total,
                    itemCount: lineItems.length,
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
        }
    }, [error]);

    return (
        <div className={cl.basketSummary}>
            <div className={cl.display}>
                <div className={cl.displayDescription}>
                    <h3>Сума:</h3>
                </div>
                <div className={cl.displayPrice}>
                    <span className={cl.price}>${formattedPrice}</span>
                </div>
            </div>
            <div>
                {error && <ErrorMassage massage='Помилка оформлення замовлення'/>}
                <Button variant='submit-primary' text='Замовити' onClick={() => onOrder()} />
            </div>
        </div>
    );
};

export default BasketSummary;






