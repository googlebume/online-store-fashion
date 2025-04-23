import React from 'react';
import shoppingCardImage from '../../../../packages/shared/src/assets/images/icons/shoppingCardImage.png'
import cl from '@/utils/styles/modules/ProductDetailedSelection.module.scss'

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
                    <img src={shoppingCardImage} alt="shoppingCardImage" />
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