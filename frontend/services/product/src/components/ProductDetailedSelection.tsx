import React from 'react';
import ShoppingCardIcon from '../../../../packages/shared/src/assets/images/icons/shoppingCardIcon.svg'
import cl from '@/utils/styles/modules/ProductDetailedSelection.module.scss'
import variables from '@packages/shared/src/utils/styles/colorScheme'

import Counter from '../../../../packages/shared/src/components/Counter'
// import Counter from '@packages/shared/src/components/Counter'

const ProductDetailedSelection = () => {
    return (
        <div className={cl.purchaseSection}>
            <div className={cl.quantityContainer}>
                <Counter />
            </div>
            <div className={cl.actionButtons}>
                <button className={cl.addToCartButton}>
                    <ShoppingCardIcon height='28px' width='28px' color={`${variables.yellow}`} fill={`${variables.yellow}`}/>
                    Додати у кошик
                </button>
                <button className={cl.wishlistButton}>
                    В обране
                </button>
            </div>
        </div>
    );
};

export default ProductDetailedSelection;