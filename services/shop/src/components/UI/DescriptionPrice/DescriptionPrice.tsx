import React from 'react';
import cl from './DescriptionPrice.module.scss'

interface DescriptionPriceProps {
    discountT: number;
    priceT: number;
    direction?: 'row' | 'column-reverse' | 'column';
  }

const DescriptionPrice: React.FC<DescriptionPriceProps> = ({discountT, priceT, direction}) => {
    const setDirectionStyle ={
        flexDirection: direction || 'column'
    }

    const discount = (+discountT * +priceT)/100;
    const price = Math.round(+priceT - +discount);
    return (
        <div className={cl.description__price} style={setDirectionStyle}>
            <span className={cl.price__discount}>{price}</span>
            <span className={cl.price}>{priceT}</span>
        </div>
    );
};

export default DescriptionPrice;