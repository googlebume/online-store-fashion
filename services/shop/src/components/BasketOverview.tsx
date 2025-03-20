import React from 'react';
import BasketProductsCard from './BasketProductsCard';

import { getAllProducts } from '@/state/targetProductData';

export type ProductType = {
    id: number;
    name: string;
    category: string;
    type: string;
    color: string;
    image: string;
    price: number;
    discount?: number;
};

const BasketOverview: React.FC = () => {
    const products: ProductType[] = getAllProducts();

    return (
        <div style={{ borderRadius: '48px', marginRight: '4px', overflowY: 'auto' }}>
            {products.length ? products.map((product) => (
                <BasketProductsCard key={product.id} data={product} />
            )) : <div style={{
                    textAlign: 'center', 
                    height: '100%',
                    display: 'flex', 
                    justifyContent: 'center',
                    alignItems: 'center',
            }}> {`Тут поки нічого немає :(`} </div>}
        </div>
    );
};

export default BasketOverview;