import React from 'react';
import cl from '@/utils/styles/ProductGallery.module.scss'
import ProductGalleryThumbnail from './UI/ProductGalleryThumbnail/ProductGalleryThumbnail';

const ProductGallery = () => {
    return (
        <div className={cl.productGallery}>
            <div className={cl.mainImageContainer}>
                <img
                    src="https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80"
                    alt="Premium Leather Jacket"
                    className={cl.mainImage}
                />
            </div>
        <ProductGalleryThumbnail />
        </div>
    );
};

export default ProductGallery;