import React, { useEffect, useState } from 'react';

import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';

import { ProductType } from '@packages/shared/src/utils/types/prosuctData.type';
import cl from '@/utils/styles/ProductLayout.module.scss'

const ProductLayout = () => {
    const [product, setProduct] = useState<ProductType>()

    window.scrollTo(0, 0)
    useEffect(() => {
        let productURL = window.location.href;
        let productName = productURL.split('/').at(-1);
        console.log('Product Name for GET:', productName);

        // POST запит
        try {
            fetch(`http://localhost:5000/shop/product`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productName }),
            })
                .then(response => {
                    if (!response.ok) throw new Error('POST request failed');
                    return response.json();
                })
                .then(data => console.log('POST response:', data))
                .catch(error => console.error('POST error:', error));
        } catch (error) {
            console.log('Помилка відправки імені товару', error);
        }

        // GET запит
        if (productName) {
            try {
                fetch(`http://localhost:5000/shop/product/${encodeURIComponent(productName)}`)
                    .then(response => {
                        if (!response.ok) throw new Error('GET request failed');
                        return response.json();
                    })
                    .then(data => {
                        setProduct(data);
                        console.log(data)
                    })
                    .catch(error => console.error('GET error:', error));
            } catch (error) {
                console.log('Помилка отримання товару', error);
            }
        }
    }, []);


    return (
        <div className={cl.productLayout}>
            {product != null && (
                <>
                    <ProductGallery image={product.image} alt={product.name}/>
                    <ProductInfo product={product}/>
                </>
            )}

        </div>
    );
};

export default ProductLayout;