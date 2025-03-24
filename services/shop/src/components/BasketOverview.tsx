import React from 'react';
import BasketProductsCard from './BasketProductsCard';

import { getAllProducts } from '@/state/targetProductData';
import EmptyBasket from './EmptyBasket';

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

interface BasketOverviewProps {
    setSummaryRenderEvent: React.Dispatch<React.SetStateAction<number>>;
}

const BasketOverview: React.FC<BasketOverviewProps> = ({setSummaryRenderEvent}) => {
    const products: ProductType[] = getAllProducts();

    return (
        <div style={{ borderRadius: '12px', marginRight: '24px', borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
            {products.length ? products.map((product) => (
                <BasketProductsCard key={product.id} data={product} setSummaryRenderEvent={setSummaryRenderEvent}/>
            )) : <EmptyBasket />}
        </div>
    );
};

export default BasketOverview;