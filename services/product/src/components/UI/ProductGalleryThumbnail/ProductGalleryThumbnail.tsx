import React from 'react';
import cl from './ProductGalleryThumbnail.module.scss'

const ProductGalleryThumbnail = () => {
    return (
        <div className={cl.thumbnailContainer}>
            <button className={cl.thumbnailButton}>
                <img
                    src="https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80"
                    alt="Premium Leather Jacket"
                    className={cl.thumbnailImage}
                />
            </button>
            <button className={cl.thumbnailButton}>
                <img
                    src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=736&q=80"
                    alt="Premium Leather Jacket Back"
                    className={cl.thumbnailImage}
                />
            </button>
            <button className={cl.thumbnailButton}>
                <img
                    src="https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80"
                    alt="Premium Leather Jacket Detail"
                    className={cl.thumbnailImage}
                />
            </button>
            <button className={cl.thumbnailButton}>
                <img
                    src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"
                    alt="Premium Leather Jacket Worn"
                    className={cl.thumbnailImage}
                />
            </button>
        </div>
    );
};

export default ProductGalleryThumbnail;