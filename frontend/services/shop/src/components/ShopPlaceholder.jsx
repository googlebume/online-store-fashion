import React from 'react';
import cl from '@/utils/styles/modules/ShopPlaceholder.module.scss'
import AsideList from '@packages/shared/src/components/AsideList';
import BannersCarousel from './BannersCarousel';
import { catalogListItems } from '@shop/utils/constants/catalogListItems';


const ShopPlaceholder = () => {
    return (
        <div className={cl.placeholder}>
                
            <div className={cl.placeholderOffers}>
                <AsideList section={catalogListItems}/>
                <BannersCarousel />
            </div>

        </div>
    );
};

export default ShopPlaceholder;

