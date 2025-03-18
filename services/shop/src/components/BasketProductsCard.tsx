import React from 'react';
import cl from '../utils/styles/BasketProductsCard.module.scss'
import Counter from './Counter';
import ButtonTrach from '@packages/shared/src/components/UI/ButtonTrash/ButtonTrash'
import DescriptionPrice from './UI/DescriptionPrice/DescriptionPrice';

const BasketProductsCard = () => {
    return (
        <div className={cl.cartItem}>
            <div className={cl.productView}>
                <img className={cl.image} />
            </div>
            
            <h3 className={cl.name}>Дуже крута футболка брат </h3>
            <div className={cl.details}>
                <Counter />
                <div className={cl.price}>
                    <DescriptionPrice discountT={12} priceT={1200} direction='column-reverse' />
                    <ButtonTrach />
                </div>
            </div>
        </div>
    );
};

export default BasketProductsCard;