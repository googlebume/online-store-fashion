import React from 'react';
import cl from '../utils/styles/BasketProductsCard.module.scss'
import Counter from './Counter';
import ButtonTrach from '@packages/shared/src/components/UI/ButtonTrash/ButtonTrash'
import DescriptionPrice from './UI/DescriptionPrice/DescriptionPrice';

import { ProductType } from "@packages/shared/src/utils/types/prosuctData.type";
interface BasketProductsCardProps {
    data: ProductType;
}
const BasketProductsCard = ({data}: BasketProductsCardProps) => {
    return (
        <div className={cl.cartItem}>
            <div className={cl.productView}>
                <img 
                    src={data.image}
                    className={cl.image} />
            </div>
            
            <h3 className={cl.name}>{data.name}</h3>
            <div className={cl.details}>
                <Counter />
                <div className={cl.price}>
                    <DescriptionPrice discountT={data.discount} priceT={data.price} direction='column-reverse' />
                    <ButtonTrach />
                </div>
            </div>
        </div>
    );
};

export default BasketProductsCard;