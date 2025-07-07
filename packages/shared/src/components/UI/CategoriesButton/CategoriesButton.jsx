import React from 'react';
import cl from './CategoriesButton.module.scss';
import squaresIcon from '@packages/shared/src/assets/images/icons/squaresIcon.svg?url'

const CategoriesButton = () => {
    return (
        <div className={cl.header__categories_catalog}>
            <div className={cl.categories_catalog__btn}>
                <img src={squaresIcon} alt="catalogIcon" className={cl.catalog__btn_image}/>
                <p>Каталог товарів</p>
            </div>
        </div>
    );
};

export default CategoriesButton;