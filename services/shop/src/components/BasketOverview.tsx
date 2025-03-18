import React from 'react';
import ProductCard from './ProductCard';
import BasketProductsCard from './BasketProductsCard';


const BasketOverview = () => {
    return (
        <div style={{
            borderRadius: '48px',
            marginRight: '4px'
        }}>
            <BasketProductsCard />
        </div>
    );
};

export default BasketOverview;