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
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                }}>
                <CatalogList />
                <BannersCarousel />
            </div>

        </div>
    );
};

export default ShopPlaceholder;