import React from 'react';
import cl from './CategoriesButton.module.scss';
import SquaresIcon from '@packages/shared/src/assets/images/icons/squaresIcon.svg'
import variables  from '@packages/shared/src/utils/styles/colorScheme'

const CategoriesButton = () => {
    return (
        <div className={cl.header__categories_catalog}>
            <div className={cl.categories_catalog__btn}>
                <SquaresIcon height='28px' width='28px' color={`${variables.yellow}`} fill={`${variables.yellow}`}/>
                <p>Каталог товарів</p>
            </div>
        </div>
    );
};

export default CategoriesButton;