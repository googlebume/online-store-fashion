import React, { useState, useRef } from 'react';
import cl from '@/utils/styles/modules/ProductGallery.module.scss'
import ProductGalleryThumbnail from './UI/ProductGalleryThumbnail/ProductGalleryThumbnail';

interface GalleryInterface {
    image: string;
    alt: string
}

const ProductGallery: React.FC<GalleryInterface> = ({image, alt}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    
    const scale: number = 1.5;

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            setMousePosition({ x, y });
        }
    };
    const imageStyle = {
        transform: isHovered ? `scale(${scale})` : 'scale(1)',
        transition: isHovered ? 'none' : 'transform 0.3s ease',
        transformOrigin: `${mousePosition.x * 100}% ${mousePosition.y * 100}%`
    };

    return (
        <div className={cl.productGallery}>
            <div 
                ref={containerRef}
                className={cl.mainImageContainer}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                style={{ overflow: 'hidden' }}
            >
                <img
                    src={image}
                    alt={alt}
                    className={cl.mainImage}
                    style={imageStyle}
                />
            </div>
            <ProductGalleryThumbnail imageSRC='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2e2B6tfaAeRQabwg2sZM2WvDysT4LN3TTPg&s'/>
        </div>
    );
};

export default ProductGallery;