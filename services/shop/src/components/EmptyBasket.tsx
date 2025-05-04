import React from 'react';
import iconBasket from '@shop/assets/images/icons/iconBasket.png'
import cl from '@shop/utils/styles/modules/EmptyBasket.module.scss'
const EmptyBasket = () => {
    return (
        <div className={cl.emptyBody}>
            <img src={iconBasket} alt="iconBasket"/>
            <div className={cl.emptyTitle}>Тут поки нічого немає :(</div>
        </div>
        
    );
};

export default EmptyBasket;