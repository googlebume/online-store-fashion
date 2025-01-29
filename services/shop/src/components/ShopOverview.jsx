import React from 'react';
import cl from '@/utils/styles/ShopOverview.module.scss'
import FiltersStickyBar from './FiltersStickyBar';
import ProductShopList from './ProductShopList';

const ShopOverview = () => {
    return (
        <div className={cl.overview} style={{marginBottom: '12px'}}>
            <div className={cl.overview__wrapper}
            style={{display:'flex', flexWrap: 'nowrap'}}>
                <FiltersStickyBar />
                <ProductShopList />
            </div>
        </div>
    );
};

export default ShopOverview;