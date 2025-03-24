import React from 'react';
import cl from '../utils/styles/BasketProductsCard.module.scss'
import Counter from './Counter';
import ButtonTrach from '@packages/shared/src/components/UI/ButtonTrash/ButtonTrash'
import DescriptionPrice from './UI/DescriptionPrice/DescriptionPrice';

import { ProductType } from "@packages/shared/src/utils/types/prosuctData.type";
import { setDeletedProducts } from '@/state/targetProductData';
interface BasketProductsCardProps {
    data: ProductType;
    setSummaryRenderEvent: React.Dispatch<React.SetStateAction<number>>;
}

const BasketProductsCard: React.FC<BasketProductsCardProps> = ({ data, setSummaryRenderEvent }) => {
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
                <Counter productName={data.name} setSummaryRenderEvent={setSummaryRenderEvent}/>
                <div className={cl.price}>
                    <DescriptionPrice discountT={data.discount} priceT={data.price} direction='column-reverse' />
                    <ButtonTrach onClick={() => setDeletedProducts(data.name)}/>
                </div>
            </div>
        </div>
    );
};


export default BasketProductsCard;