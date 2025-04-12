import React from 'react';
import cl from '@/utils/styles/ProductGallery.module.scss'
import ProductGalleryThumbnail from './UI/ProductGalleryThumbnail/ProductGalleryThumbnail';

interface GalleryInterface{
    image: string;
    alt: string
}

const ProductGallery: React.FC<GalleryInterface> = ({image, alt}) => {
    return (
        <div className={cl.productGallery}>
            <div className={cl.mainImageContainer}>
                <img
                    src={image}
                    alt={alt}
                    className={cl.mainImage}
                />
            </div>
        <ProductGalleryThumbnail />
        </div>
    );
};

export default ProductGallery;