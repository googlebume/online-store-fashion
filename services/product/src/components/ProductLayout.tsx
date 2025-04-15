import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useParams, useNavigate  } from 'react-router-dom';
import {api} from '@packages/shared/src/routes/api'

import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';

import { ProductType, ProductAttrType } from '@packages/shared/src/utils/types/prosuctData.type';
import cl from '@/utils/styles/ProductLayout.module.scss'


const ProductLayout = () => {
    const [product, setProduct] = useState<ProductType | null>(null);
    const [allResponce, setAllResponce] = useState<ProductType[] | null>(null);
    const [colorsList, setColorsList] = useState(null);
    const [currentColor, setCurrentColor] = useState<String>()
    const [currentImage, setCurrentImage] = useState<string>()

    useEffect(() => {
        window.scrollTo(0, 0);
        const productURL = window.location.href;
        const productName = productURL.split('/').at(-1);

        console.log('Product Name for GET:', productName);

        if (productName) {
            fetch(`http://localhost:5000/${api}/shop/product/${encodeURIComponent(productName)}`)
                .then(response => {
                    if (!response.ok) throw new Error('GET request failed');
                    return response.json();
                })
                .then(data => {
                    if (Array.isArray(data) && data.length > 0) {
                        setProduct(data[0]);
                        console.log('GET response:', data);
                        
                        setAllResponce(data);
                        console.log('data', data);
                    } else {
                        console.warn('Продукт не знайдено');
                    }
                })
                .catch(error => console.error('GET error:', error));
        }
    }, []);

    useEffect(() => {
        if (allResponce) {
            const colors = allResponce.flatMap((product: ProductType) =>
                product.attributes.map((attribute: ProductAttrType) => ({
                    id: product.id,
                    color: attribute.color
                }))
            );
            setColorsList(colors);
            console.log(colors)
        }
    }, [allResponce, product]);


    useEffect(() => {
        setCurrentColor((product?.attributes?.[0] as ProductAttrType)?.color)
    },[product])

    useEffect(() => {
        if (!allResponce) return;
    
        const findProductWithUpdatedImage = allResponce.find((product) =>
            (product?.attributes?.[0] as ProductAttrType)?.color === currentColor
        );
    
        if (findProductWithUpdatedImage) {
            setCurrentImage(findProductWithUpdatedImage.image);
        }
    }, [allResponce, currentColor]);
    

    return (
        <div className={cl.productLayout}>
            {product && (
                <>
                    <ProductGallery image={currentImage || product.image} alt={product.name} />
                    <ProductInfo
                        product={product}
                        colorsList={colorsList}
                        curentColor={currentColor} 
                        setCurrentColor={setCurrentColor}
                    />
                </>
            )}
        </div>
    );
};


export default ProductLayout;