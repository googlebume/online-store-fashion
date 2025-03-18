import React from 'react';
import cl from './DescriptionPrice.module.scss'

interface DescriptionPriceProps {
    discountT: number;
    priceT: number;
  }

const DescriptionPrice: React.FC<DescriptionPriceProps> = ({discountT, priceT}) => {
    const discount = (+discountT * +priceT)/100;
    const price = Math.round(+priceT - +discount);
    return (
        <div className={cl.description__price}>
            <span className={cl.price__discount}>{price}</span>
            <span className={cl.price}>{priceT}</span>
        </div>
    );
};

export default DescriptionPrice;