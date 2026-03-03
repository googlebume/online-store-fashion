import React from 'react';
import cl from './DisplayDiscount.module.scss'

type DisplayDiscountType = {
    discount: number
}

const DisplayDiscount: React.FC<DisplayDiscountType> = ({ discount}) => {
    return (
        <div className={cl.display}>
            <span className={cl.discount}>-{discount}%</span>
        </div>
    );
};

export default DisplayDiscount;


