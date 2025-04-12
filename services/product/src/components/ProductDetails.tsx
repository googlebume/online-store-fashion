import React from 'react';
import cl from '@/utils/styles/ProductDetails.module.scss'
import ProductDescription from './UI/ProductDescription/ProductDescription';
import ProductPriceSteps from './UI/ProductPriceSteps/ProductPriceSteps';
import ProductTitle from './UI/ProductTitle/ProductTitle';
type DetailsType = {
    title: string;
    price: number;
    discoint: number;
    description: string
}
const ProductDetails: React.FC<DetailsType> = ({title, price, discoint, description}) => {
    return (
        <div className={cl.productDetails}>
            <ProductTitle title={title}/>
            <ProductPriceSteps price={price} discount={discoint}/>
            <ProductDescription>{description}</ProductDescription>
        </div>
    );
};

export default ProductDetails;