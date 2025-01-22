import React from 'react';
import cl from './CategoriesButton.module.scss';
import cataligIcon from '@packages/shared/src/assets/images/icons/cataligIcon.png'

const CategoriesButton = () => {
    return (
        <div className={cl.header__categories_catalog}>
            <div className={cl.categories_catalog__btn}>
                <img src={cataligIcon} alt="cataligIcon" className={cl.catalog__btn_image}/>
                <p>Каталог товарів</p>
            </div>
        </div>
    );
};

export default CategoriesButton;