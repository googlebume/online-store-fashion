import React from 'react';

import ProductDetailedSelection from './ProductDetailedSelection';
import ProductDetails from './ProductDetails';
import ProductSizeSelection from './ProductSizeSelection';
import ProductDetailsAccordion from './ProductDetailsAccordion';
import ColorSelection from './ColorSelection';

import { ProductType } from '@packages/shared/src/utils/types/prosuctData.type';
import cl from '@/utils/styles/ProductInfo.module.scss'

type ProductInfoType = {
    product: ProductType
}
const ProductInfo: React.FC<ProductInfoType> = ({product}) => {
    return (
        <div className={cl.productInfo}>
            <ProductDetails title={product.name} discoint={product.discount} price={product.price} description={product.description}/>

            {/* Color Selection */}
            <ColorSelection />

            {/* Size Selection */}
            <ProductSizeSelection />

            {/* Quantity & Add to Cart          Тут треба щось рішать*/}
            <ProductDetailedSelection />

            {/* Product Details Accordion */}
            <ProductDetailsAccordion />
        </div>
    );
};

export default ProductInfo;