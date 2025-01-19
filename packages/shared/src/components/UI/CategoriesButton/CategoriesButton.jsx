import React from 'react';
import cl from './CategoriesButton.module.scss';

const CategoriesButton = () => {
    return (
        <div className={cl.header__categories_catalog}>
            <span className={cl.categories_catalog__btn}>
                Каталог товарів
            </span>
        </div>
    );
};

export default CategoriesButton;