import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

const ProductShopList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3004/shop')
            .then(response => response.json())
            .then(data => {
                console.log(data); 
                setProducts(data); // Оновлюємо стан
            })
            .catch(error => console.error('Error fetching products:', error));
    }, []); // Виконувати тільки при монтуванні компонента

    return (
        <section style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(257px, 1fr))',
            gap: '8px 6px',
            width: '100%'
        }}>
            {products.map((card) => (
                <ProductCard key={card.name} name={card.name} price={card.price} discount={card.discount} image={card.image}/>
            ))}
        </section>
    );
};

export default ProductShopList;
