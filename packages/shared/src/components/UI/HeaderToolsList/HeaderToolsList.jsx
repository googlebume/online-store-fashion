import React from 'react';
import cl from './HeaderToolsList.module.scss';
import shoppingCardImage from '@packages/shared/src/assets/images/icons/shoppingCardImage.png'

const HeaderToolsList = () => {
    return (
        <div className={cl.header__tools}>
            <div className={cl.tools__btn}>
                <img className={cl.tool__img} src={shoppingCardImage} alt='Кошик'></img>
                <p>Кошик</p>
            </div>
        </div>
    );
};

export default HeaderToolsList;