import React from 'react';
import cl from '@/utils/styles/ShopOverview.module.scss'
import FiltersStickyBar from './FiltersStickyBar';
import ProductShopList from './ProductShopList';

const ShopOverview = () => {
    return (
        <div className={cl.overview}>
            <div className={cl.overview__wrapper}>
                <FiltersStickyBar />
                <ProductShopList />
            </div>
        </div>
    );
};

export default ShopOverview;