import React from 'react';
import cl from '@/utils/styles/ProductSizeSelection.module.scss'

const ProductSizeSelection = () => {
    return (
        <div className={cl.sizeSelection}>
            <div className={cl.sizeHeader}>
                <h3 className={cl.sizeTitle}>Розмір:</h3>
                <a href="https://3cm.com.ua/image/catalog/1_%D0%9A%D0%B0%D1%82%D0%B5%D0%B3%D0%BE%D1%80%D0%B8%D0%B8/Tabl_Size_800x600_ukr.png" className={cl.sizeGuideLink}>Таблиця розмірів</a>
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