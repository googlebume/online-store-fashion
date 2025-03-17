import React from 'react';
import ProductCard from './ProductCard';
import BasketProductsCard from './BasketProductsCard';
import BasketDelivery from './BasketDelivery';


const BasketOverview = () => {
    return (
        <div style={{
            width: '1000px',
            height: '600px',
            background: 'white',
            borderRadius: '24px',
            margin: '0, auto',
            padding: '24px',
            display: 'grid',
            gridTemplateColumns: '2fr 1fr'
        }}>
            <BasketProductsCard />
            <BasketDelivery />
        </div>
    );
};

export default BasketOverview;