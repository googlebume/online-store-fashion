import React from 'react';
import cl from './ProductPriceSteps.module.scss'

import {useDiscountPrice} from '@packages/shared/src/utils/hooks/useDiscountPrice'
type PriceType = {
    price: number;
    discount?: number;
}

const ProductPriceSteps: React.FC<PriceType> = ({price, discount}) => {
    const { finalPrice, discountAmount, discountPercent } = useDiscountPrice({ price, discount });
    return (
        <div className={cl.priceContainer}>
            {discount ?
                <>
                    <span className={cl.currentPrice}> {`${finalPrice}грн`}</span>
                    <span className={cl.oldPrice}>{`${price}`}</span>
                    <span className={cl.discountBadge}>{`-${discountPercent}%`}</span>
                </>
                    : <>
                        <span className={cl.currentPrice}>{`${price} грн`}</span>
                    </>
            }
            
        </div>
    );
};

export default ProductPriceSteps;