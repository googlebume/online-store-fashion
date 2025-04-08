import React from 'react';
import cl from '@/utils/styles/ProductSizeSelection.module.scss'

const ProductSizeSelection = () => {
    return (
        <div className={cl.sizeSelection}>
            <div className={cl.sizeHeader}>
                <h3 className={cl.sizeTitle}>Розмір:</h3>
                <a href="#" className={cl.sizeGuideLink}>Таблиця розмірів</a>
            </div>
            <div className={cl.sizeOptions}>
                <button className={cl.sizeButton}>XS</button>
                <button className={cl.sizeButton}>S</button>
                <button className={`${cl.sizeButton} ${cl.selected}`}>M</button>
                <button className={cl.sizeButton}>L</button>
                <button className={cl.sizeButton}>XL</button>
            </div>
        </div>
    );
};

export default ProductSizeSelection;