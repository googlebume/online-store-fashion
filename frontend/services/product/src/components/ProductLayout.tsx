import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';

import { ProductType, ProductAttrType } from '@packages/shared/src/utils/types/prosuctData.type';
import cl from '@/utils/styles/modules/ProductLayout.module.scss';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';

const ProductLayout = () => {
    const { name: productNameFromRoute } = useParams<{ name: string }>();
    const [product, setProduct] = useState<ProductType | null>(null);
    const [allResponce, setAllResponce] = useState<ProductType[] | null>(null);
    const [colorsList, setColorsList] = useState(null);
    const [currentColor, setCurrentColor] = useState<String>();
    const [currentImage, setCurrentImage] = useState<string>();
    const { response, error, isLoading, fetchData } = useFetch<null, ProductType[]>();
    const clicksRef = useRef(0);



    useEffect(() => {
        const handleOnUnload = () => {
            if (!product) return;
            
            fetch('http://localhost:5007/fashion/products-analytics/update-engagement-metrics', {
                method: 'POST',
                keepalive: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: product.id,
                    metrics: {
                        views: 1,
                        clicks: clicksRef.current,
                        orders: 0
                    }
                })
            });
        }
        const handleOnClick = () =>{
            clicksRef.current++
            console.log(clicksRef.current)
        }

        document.addEventListener('click', handleOnClick)
        window.addEventListener('beforeunload', handleOnUnload)

        return () => {
            document.removeEventListener('click', handleOnClick)
            window.removeEventListener('beforeunload', handleOnUnload)
        }
    }, [product])



    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });

        const productName = productNameFromRoute?.trim();
        if (!productName) {
            return;
        }

        fetchData({
            method: 'GET',
            url: `shop/product/${encodeURIComponent(productName)}`,
            port: 5000,
        });
    }, [productNameFromRoute, fetchData]);

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

    const productForCart = useMemo(() => {
        if (!product) {
            return null;
        }
        if (!allResponce?.length) {
            return product;
        }
        const colorVal = currentColor as string | undefined;
        if (!colorVal) {
            return product;
        }
        const variant = allResponce.find(
            (p) => (p?.attributes?.[0] as ProductAttrType)?.color === colorVal,
        );
        return variant ?? product;
    }, [product, allResponce, currentColor]);

    return (
        <div className={cl.productLayout}>
            {product && productForCart && (
                <>
                    <ProductGallery image={currentImage || product.image} alt={product.name} />
                    <ProductInfo
                        product={product}
                        productForCart={productForCart}
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
