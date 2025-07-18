// import React from 'react';
// import cl from '../utils/styles/BasketProductsCard.module.scss'
// import Counter from '../../../../packages/shared/src/components/Counter';
// import ButtonTrach from '@packages/shared/src/components/UI/ButtonTrash/ButtonTrash'
// import DescriptionPrice from './UI/DescriptionPrice/DescriptionPrice';

// import { ProductType } from "@packages/shared/src/utils/types/prosuctData.type";
// import { setDeletedProducts } from '@/state/targetProductData';
// interface BasketProductsCardProps {
//     data: ProductType;
//     setSummaryRenderEvent: React.Dispatch<React.SetStateAction<number>>;
// }

// const BasketProductsCard: React.FC<BasketProductsCardProps> = ({ data, setSummaryRenderEvent }) => {
//     return (
//         <div className={cl.cartItem}>
//             <div className={cl.productView}>
//                 <img 
//                     src={data.image}
//                     className={cl.image} 
//                     alt={data.name} />
//             </div>
            
//             <h3 className={cl.name}>{data.name}</h3>
//             <div className={cl.details}>
//                 <Counter productName={data.name} setSummaryRenderEvent={setSummaryRenderEvent}/>
//                 <div className={cl.price}>
//                     <DescriptionPrice discountT={data.discount} priceT={data.price} direction='column-reverse' />
//                     <ButtonTrach onClick={() => setDeletedProducts(data.name)} setSummaryRenderEvent={setSummaryRenderEvent}/>
//                 </div>
//             </div>
//         </div>
//     );
// };


// export default BasketProductsCard;

import React from 'react';
import cl from '@shop/utils/styles/modules/BasketProductsCard.module.scss';
import Counter from '@packages/shared/src/components/Counter';
import ButtonTrash from '@packages/shared/src/components/UI/ButtonTrash/ButtonTrash';
import DescriptionPrice from './UI/DescriptionPrice/DescriptionPrice';
import { removeFromCart } from '@shop/state/basketState';
import { ProductType } from '@packages/shared/src/utils/types/prosuctData.type';

interface BasketProductsCardProps {
    data: ProductType & {
        quantity: number;
    }
    // {
    //     id?: number;
    //     name: string;
    //     category?: string;
    //     type?: string;
    //     color?: string;
    //     image: string;
    //     price: number;
    //     discount?: number;
    //     quantity: number;
    // };
}

const BasketProductsCard: React.FC<BasketProductsCardProps> = ({ data }) => {
    const handleRemove = () => {
        removeFromCart(data.name);
    };

    return (
        <div className={cl.cartItem}>
            <div className={cl.productView}>
                <img 
                    src={data.image}
                    className={cl.image} 
                    alt={data.name} />
            </div>
            
            <h3 className={cl.name}>{data.name}</h3>
            <div className={cl.details}>
                <Counter 
                    productName={data.name} 
                    initialQuantity={data.quantity}
                />
                <div className={cl.price}>
                    <DescriptionPrice 
                        discountT={data.discount} 
                        priceT={data.price} 
                        direction='column-reverse' 
                    />
                    <ButtonTrash onClick={handleRemove} />
                </div>
            </div>
        </div>
    );
};

export default BasketProductsCard;