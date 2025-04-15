import React from 'react';
import cl from './App.module.scss';
import ProductsRelated from '../ProductsRelated';
import ReviewsSection from '../ReviewsSection';
import ProductLayout from '../ProductLayout';
import { useParams } from 'react-router-dom';

export const App = () => {
    const { name } = useParams()

    return (
        <div className={cl.productPage}>
            <div className={cl.productContainer}>
                <ProductLayout key={name} />
            </div>
            <ProductsRelated />
            <ReviewsSection />
        </div>
    );
};
