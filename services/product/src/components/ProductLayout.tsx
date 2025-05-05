import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { api } from '@packages/shared/src/routes/api';

import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';

import { ProductType, ProductAttrType } from '@packages/shared/src/utils/types/prosuctData.type';
import cl from '@/utils/styles/modules/ProductLayout.module.scss';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';

const ProductLayout = () => {
    const [product, setProduct] = useState<ProductType | null>(null);
    const [allResponce, setAllResponce] = useState<ProductType[] | null>(null);
    const [colorsList, setColorsList] = useState(null);
    const [currentColor, setCurrentColor] = useState<String>();
    const [currentImage, setCurrentImage] = useState<string>();
    const { response, error, isLoading, fetchData } = useFetch<null, ProductType[]>();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });

        const productURL = window.location.href;
        const productName = productURL.split('/').at(-1);

        console.log('Product Name for GET:', productName);

        if (productName) {
            fetchData({
                method: 'GET',
                url: `shop/product/${encodeURIComponent(productName)}`,
                port: 5000,
            });
        }
    }, []);

    useEffect(() => {
        if (response && Array.isArray(response) && response.length > 0) {
            setProduct(response[0]);
            console.log('GET response:', response);
            setAllResponce(response);
            console.log('data', response);
        } else if (response && Array.isArray(response) && response.length === 0) {
            console.warn('Продукт не знайдено');
        }
    }, [response]);

    useEffect(() => {
        if (allResponce) {
            const colors = allResponce.flatMap((product: ProductType) =>
                product.attributes.map((attribute: ProductAttrType) => ({
                    id: product.id,
                    color: attribute.color,
                }))
            );
            setColorsList(colors);
            console.log(colors);
        }
    }, [allResponce, product]);

    useEffect(() => {
        setCurrentColor((product?.attributes?.[0] as ProductAttrType)?.color);
    }, [product]);

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
