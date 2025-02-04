import React from 'react';
import productsDB from '@/utils/constants/productsDB.js'
import ProductCard from './ProductCard';

const ProductShopList = () => {
    return (
        <section style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(257px, 1fr))',
            gap: '8px 6px',
            width: '100%'
        }}>
            {productsDB.map((card) => (
                <ProductCard name={card.name} price={card.price} discount={card.discount} image={card.image}/>
            ))}
            
        </section>
    );
};

export default ProductShopList;