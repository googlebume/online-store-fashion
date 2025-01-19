import React from 'react';
import cl from './HeaderToolsList.module.scss';

const HeaderToolsList = () => {
    return (
        <div className={cl.header__tools}>
            <span className={cl.tools__btn}>
                <img className={cl.tool__img}></img>
                Кошик
            </span>
        </div>
    );
};

export default HeaderToolsList;