// import React, { useEffect, useState } from 'react';

// import cl from '@/utils/styles/BasketSummary.module.scss';
// import ButtonOrder from '@packages/shared/src/components/UI/ButtonOrder/ButtonOrder';
// import { getAllPrices, getDeletedProducts } from '@/state/targetProductData';

// const BasketSummary = (summaryRenderEvent:any) => {

//     const [finalPrice, setFinalPrice] = useState(0);
//     const [allPrices, setAllPrices] = useState(getAllPrices());
//     const [deletedProductsList, setDeletedProductsList] = useState(getDeletedProducts());
//     console.log(allPrices);
//     useEffect(() => {
//         // Оновлюємо список цін при зміні списку видалених продуктів
//         const updatedPrices = getAllPrices();
//         setAllPrices(updatedPrices);
//         const updatedDelProd = getDeletedProducts();
//         setDeletedProductsList(updatedDelProd)

//         console.warn('yesss');
//             const totalPrice = Object.values(updatedPrices).reduce((sum, price) => sum + price, 0);
//             setFinalPrice(totalPrice);
//             console.log('final', totalPrice);

//     }, [deletedProductsList, allPrices, summaryRenderEvent]);


//     return (
//         <div className={cl.basketSummary}>
//             <div className={cl.display}>
//                 <div className={cl.displayDescription}>
//                     <h3>Сума:</h3>
//                 </div>
//                 <div className={cl.displayPrice}>
//                     <span className={cl.price}>${finalPrice}</span>
//                 </div>
//             </div>
//             <div>
//                 <ButtonOrder text='Замовити' />
//             </div>
            
//         </div>
//     );
// };

// export default BasketSummary;


import React, { useEffect, useState } from 'react';
import cl from '@/utils/styles/modules/BasketSummary.module.scss';
import ButtonOrder from '@packages/shared/src/components/UI/ButtonOrder/ButtonOrder';
import { getTotalPrice, subscribeToCartChanges } from '@/state/basketState';

const BasketSummary: React.FC = () => {
    const [finalPrice, setFinalPrice] = useState(getTotalPrice());

    useEffect(() => {
        // Підписуємося на зміни в кошику і оновлюємо загальну ціну
        const unsubscribe = subscribeToCartChanges(() => {
            setFinalPrice(getTotalPrice());
        });
        
        return () => unsubscribe();
    }, []);

    // Форматуємо ціну до двох десяткових знаків
    const formattedPrice = finalPrice.toFixed(2);

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
                <ButtonOrder text='Замовити' />
            </div>
        </div>
    );
};

export default BasketSummary;