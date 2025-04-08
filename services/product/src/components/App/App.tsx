import React, { useState } from 'react';
import { Link, Outlet } from "react-router-dom";
import cl from './App.module.scss'
import ColorSelection from '../ColorSelection';
import ProductGallery from '../ProductGallery';
import ProductDetailedSelection from '../ProductDetailedSelection';
import ProductDetails from '../ProductDetails';
import ProductSizeSelection from '../ProductSizeSelection';
import ProductDetailsAccordion from '../ProductDetailsAccordion';
import ProductsRelated from '../ProductsRelated';
import ReviewsSection from '../ReviewsSection';

export const App = () => {

    return (
        <div className={cl.productPage}>
            {/* Product Section */}
            <div className={cl.productContainer}>
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
            </div>

            {/* Related Products */}
            <ProductsRelated />

            {/* Reviews Section */}
            <ReviewsSection />
        </div>
    );
};

