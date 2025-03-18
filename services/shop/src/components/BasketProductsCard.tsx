import React from 'react';
import cl from '../utils/styles/BasketProductsCard.module.scss'
import Counter from './Counter';
import ButtonTrach from '@packages/shared/src/components/UI/ButtonTrash/ButtonTrash'
import DescriptionPrice from './UI/DescriptionPrice/DescriptionPrice';

const BasketProductsCard = () => {
    return (
        <div className={cl.cartItem}>
            <img className={cl.image} />
            <div className={cl.details}>
                <h3 className={cl.name}></h3>
                <Counter />
                <DescriptionPrice discountT={12} priceT={1200}/>
                <ButtonTrach />
            </div>
        </div>
    );
};

export default BasketProductsCard;