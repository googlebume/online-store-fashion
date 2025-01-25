import React from 'react';
import CatalogList from './CatalogList';
import BannersCarousel from './BannersCarousel';


const ShopPlaceholder = () => {
    return (
        <div style={{
            maxWidth: '1440px',
            padding: '0 16px',
            margin: '0 auto 8px auto',
        }}
            className='placeholder'>
                
            <div className='placeholder__offers'
                style={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    justifyContent: 'space-between',
                    
                }}>
                <CatalogList />
                <BannersCarousel />
            </div>

        </div>
    );
};

export default ShopPlaceholder;