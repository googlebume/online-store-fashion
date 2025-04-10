import React, { useEffect } from 'react';

import ProductGallery from './ProductGallery';
import ProductDetailedSelection from './ProductDetailedSelection';
import ProductDetails from './ProductDetails';
import ProductSizeSelection from './ProductSizeSelection';
import ProductDetailsAccordion from './ProductDetailsAccordion';
import ColorSelection from './ColorSelection';

import cl from '@/utils/styles/ProductLayout.module.scss'
const ProductLayout = () => {
    useEffect(() => {
        let productURL = window.location.href;
        let productName = productURL.split('/').at(-1);
        console.log('Product Name for GET:', productName);
        
        // POST запит
        try {
            fetch(`http://localhost:4001/shop/product`, {  // Правильний URL без символа *
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productName }),  // Відправляємо productName як і очікує контролер
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
        if (productName) { // Перевіряємо, що productName існує
            try {
                fetch(`http://localhost:4001/shop/product/${encodeURIComponent(productName)}`)
                    .then(response => {
                        if (!response.ok) throw new Error('GET request failed');
                        return response.json();
                    })
                    .then(data => {
                        console.log(data);
                    })
                    .catch(error => console.error('GET error:', error));
            } catch (error) { 
                console.log('Помилка отримання товару', error);
            }
        }
    }, []);


    return (
        <div className={cl.productLayout}>
            {/* Product Gallery */}
            <ProductGallery />

            {/* Product Info */}
            <div className={cl.productInfo}>
                <ProductDetails />

                {/* Color Selection */}
                <ColorSelection />

                {/* Size Selection */}
                <ProductSizeSelection />

                {/* Quantity & Add to Cart          Тут треба щось рішать*/}
                <ProductDetailedSelection />

                {/* Product Details Accordion */}
                <ProductDetailsAccordion />
            </div>
        </div>
    );
};

export default ProductLayout;