import React from 'react';
import cl from './ProductGalleryThumbnail.module.scss'

const ProductGalleryThumbnail = ({imageSRC}: {imageSRC: string}) => {
    return (
        <div className={cl.thumbnailContainer}>
            <button className={cl.thumbnailButton}>
                <img
                    src={imageSRC}
                    alt="none"
                    className={cl.thumbnailImage}
                />
            </button>
            <button className={cl.thumbnailButton}>
                <img
                    src={imageSRC}
                    alt="none"
                    className={cl.thumbnailImage}
                />
            </button>
            <button className={cl.thumbnailButton}>
                <img
                    src={imageSRC}
                    alt="none"
                    className={cl.thumbnailImage}
                />
            </button>
            <button className={cl.thumbnailButton}>
                <img
                    src={imageSRC}
                    alt="none"
                    className={cl.thumbnailImage}
                />
            </button>
        </div>
    );
};

export default ProductGalleryThumbnail;