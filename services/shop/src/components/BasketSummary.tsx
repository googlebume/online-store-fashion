import React, { useEffect, useState } from 'react';
import cl from '@shop/utils/styles/modules/BasketSummary.module.scss';
import { getCartItems, getTotalPrice, subscribeToCartChanges } from '@shop/state/basketState';
import SubmitButton from '@packages/shared/src/components/UI/SubmitButton/SubmitButton';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';

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
        console.log(deliveryParams.total)
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

        fetchData({
            method: 'POST',
            port: 4006,
            url: 'ordering/add',
            body: order,
        });
    }

    useEffect(() => {
        if (response?.success) {
            console.log("EHF")
        }
    }, [response])

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
                <SubmitButton text='Замовити' onClick={() => onOrder()} />
            </div>
        </div>
    );
};

export default BasketSummary;