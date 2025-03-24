import React, { useEffect, useState } from 'react';

import cl from '@/utils/styles/BasketSummary.module.scss';
import ButtonOrder from '@packages/shared/src/components/UI/ButtonOrder/ButtonOrder';
import { getAllPrices } from '@/state/targetProductData';

const BasketSummary = (summaryRenderEvent:any) => {
    const [finalPrice, setFinalPrice] = useState(0);
    const [allPrices, setAllPrices] = useState(getAllPrices());
    console.log(allPrices);
    useEffect(() => {
        console.warn('yesss')
        // Перевіряємо, чи є елементи в об'єкті, а не довжину
        if (Object.keys(allPrices).length > 0) {
            const totalPrice = Object.values(allPrices).reduce((sum, price) => sum + price, 0);
            setFinalPrice(totalPrice);
            console.log('final', totalPrice);
        } else {
            setFinalPrice(0);
        }
    }, [summaryRenderEvent]);

    return (
        <div className={cl.basketSummary}>
            <div className={cl.display}>
                <div className={cl.displayDescription}>
                    <h3>Сума:</h3>
                </div>
                <div className={cl.displayPrice}>
                    <span className={cl.price}>${finalPrice}</span>
                </div>
            </div>
            <ButtonOrder text='Замовити' />
        </div>
    );
};

export default BasketSummary;
