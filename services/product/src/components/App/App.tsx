import React, { useState } from 'react';
import { Link, Outlet } from "react-router-dom";
import cl from './App.module.scss'
import ProductsRelated from '../ProductsRelated';
import ReviewsSection from '../ReviewsSection';
import ProductLayout from '../ProductLayout';

export const App = () => {

    return (
        <div className={cl.productPage}>
            {/* Product Section */}
            <div className={cl.productContainer}>
                <ProductLayout />
            </div>

            {/* Related Products */}
            <ProductsRelated />

            {/* Reviews Section */}
            <ReviewsSection />
        </div>
    );
};

