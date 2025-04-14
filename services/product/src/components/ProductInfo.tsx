import React from 'react';

import ProductDetailedSelection from './ProductDetailedSelection';
import ProductDetails from './ProductDetails';
import ProductSizeSelection from './ProductSizeSelection';
import ProductDetailsAccordion from './ProductDetailsAccordion';
import ColorSelection from './ColorSelection';

import { ProductType } from '@packages/shared/src/utils/types/prosuctData.type';
import cl from '@/utils/styles/ProductInfo.module.scss'

type Color = {
    id: number;
    color: string;
}
type ProductInfoType = {
    product: ProductType;
    colorsList: Color[];
    curentColor: String;
    setCurrentColor: React.Dispatch<React.SetStateAction<string>>;
}
const ProductInfo: React.FC<ProductInfoType> = ({product, colorsList, curentColor, setCurrentColor}) => {
    return (
        <div className={cl.productInfo}>
            <ProductDetails title={product.name} discoint={product.discount} price={product.price} description={product.description}/>

            {/* Color Selection */}
            <ColorSelection colorsList={colorsList} curentColor={curentColor} setCurrentColor={setCurrentColor}/>

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