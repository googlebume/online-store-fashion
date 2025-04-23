import React from 'react';
import cl from '@/utils/styles/modules/ShopPlaceholder.module.scss'
import CatalogList from './CatalogList';
import BannersCarousel from './BannersCarousel';


const ShopPlaceholder = () => {
    return (
        <div className={cl.placeholder}>
                
            <div className={cl.placeholderOffers}>
                <CatalogList />
                <BannersCarousel />
            </div>

        </div>
    );
};

export default ShopPlaceholder;