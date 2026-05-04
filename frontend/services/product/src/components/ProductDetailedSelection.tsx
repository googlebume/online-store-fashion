import React, { useEffect, useState } from 'react';
import ShoppingCardIcon from '../../../../packages/shared/src/assets/images/icons/shoppingCardIcon.svg';
import cl from '@/utils/styles/modules/ProductDetailedSelection.module.scss';
import variables from '@packages/shared/src/utils/styles/colorScheme';
import Button from '../../../../packages/shared/src/components/UI/Button/Button';
import counterCl from '../../../../packages/shared/src/utils/styles/modules/Counter.module.scss';
import { addToCart } from '../../../../packages/shared/src/state/basketState';
import type { ProductType } from '@packages/shared/src/utils/types/prosuctData.type';
import { trackAnalytics } from '@packages/shared/src/utils/analytics/trackAnalytics';
import {
    ECOMMERCE_CURRENCY,
    lineValue,
    toGa4Item,
} from '@packages/shared/src/utils/analytics/ecommercePayload';

type Props = {
    productForCart: ProductType;
};

const ProductDetailedSelection: React.FC<Props> = ({ productForCart }) => {
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        setQuantity(1);
    }, [productForCart.id, productForCart.image]);

    const dec = () => setQuantity((q) => Math.max(1, q - 1));
    const inc = () => setQuantity((q) => Math.min(99, q + 1));

    const handleAddToCart = () => {
        addToCart(productForCart, quantity);
    };

    return (
        <div className={cl.purchaseSection}>
            <div className={cl.quantityContainer}>
                <div className={counterCl.quantityControls}>
                    <Button variant="counter" onClick={dec}>
                        -
                    </Button>
                    <span className={counterCl.quantityValue}>{quantity}</span>
                    <Button variant="counter" onClick={inc}>
                        +
                    </Button>
                </div>
            </div>
            <div className={cl.actionButtons}>
                <button type="button" className={cl.addToCartButton} onClick={handleAddToCart}>
                    <ShoppingCardIcon height="28px" width="28px" color={`${variables.yellow}`} fill={`${variables.yellow}`} />
                    Додати у кошик
                </button>
                <button
                    type="button"
                    className={cl.wishlistButton}
                    onClick={() =>
                        trackAnalytics({
                            name: 'add_to_wishlist',
                            productId: productForCart.id,
                            payload: {
                                currency: ECOMMERCE_CURRENCY,
                                value: lineValue(productForCart, 1),
                                ...toGa4Item(productForCart, 1),
                            },
                        })
                    }
                >
                    В обране
                </button>
            </div>
        </div>
    );
};

export default ProductDetailedSelection;
