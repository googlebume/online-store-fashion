// import React, {useState, useEffect} from 'react';
// import cl from '@/utils/styles/BasketOverview.module.scss'
// import BasketProductsCard from './BasketProductsCard';

// import { getAllProducts, setRenderCallback } from '@/state/targetProductData';
// import EmptyBasket from './EmptyBasket';

// export type ProductType = {
//     id: number;
//     name: string;
//     category: string;
//     type: string;
//     color: string;
//     image: string;
//     price: number;
//     discount?: number;
// };

// interface BasketOverviewProps {
//     setSummaryRenderEvent: React.Dispatch<React.SetStateAction<number>>;
// }

// const BasketOverview: React.FC<BasketOverviewProps> = ({setSummaryRenderEvent}) => {
//     const [renderTrigger, setRenderTrigger] = useState(0);
//     const products: ProductType[] = getAllProducts();
//     const forceRender = () => setRenderTrigger(prev => prev + 1);

//     useEffect(() => {
//         setRenderCallback(forceRender); // Передаємо функцію примусового ререндеру
//         return () => setRenderCallback(null); // Очищаємо після видалення компонента
//     }, []);

//     return (
//         <div className={cl.basketOverview}>
//             {products.map((product) => (
//                 <BasketProductsCard
//                     key={product.id}
//                     data={product}
//                     setSummaryRenderEvent={setSummaryRenderEvent}
//                 />
//             ))}
//         </div>
//     );
    
// };

// export default BasketOverview;

import React, { useEffect, useState } from 'react';
import cl from '@shop/utils/styles/modules/BasketOverview.module.scss';
import BasketProductsCard from './BasketProductsCard';
import { getCartItems, subscribeToCartChanges } from '@shop/state/basketState';
import { ProductType } from "@packages/shared/src/utils/types/prosuctData.type";

const BasketOverview: React.FC = () => {
    const [products, setProducts] = useState<(ProductType & { quantity: number })[]>(getCartItems());

    useEffect(() => {
        // підпиcка на зміни в кошику
        const unsubscribe = subscribeToCartChanges(() => {
            setProducts(getCartItems());
        });
        
        return () => unsubscribe();
    }, []);

    return (
        <div className={cl.basketOverview}>
            {products.map((product) => (
                <BasketProductsCard
                    key={product.name}
                    data={product}
                />
            ))}
        </div>
    );
};

export default BasketOverview;