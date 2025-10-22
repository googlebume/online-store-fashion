import React, { useEffect, useState } from 'react';
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