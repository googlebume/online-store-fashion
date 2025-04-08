import React from 'react';
import cl from '@/utils/styles/ProductDetails.module.scss'

const ProductDetails = () => {
    return (
        <div className={cl.productDetails}>
            <h1 className={cl.productTitle}>Шкіряна куртка Premium</h1>
            <div className={cl.ratingContainer}>
                <div className={cl.ratingStars}>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star-half-alt"></i>
                </div>
                {/* <span className={cl.ratingCount}>(42 відгуки)</span> */}
            </div>
            <div className={cl.priceContainer}>
                <span className={cl.currentPrice}>₴4,999</span>
                <span className={cl.oldPrice}>₴6,499</span>
                <span className={cl.discountBadge}>-23%</span>
            </div>
            <p className={cl.productDescription}>
                Елегантна шкіряна куртка преміум якості з м'якою підкладкою.
                Виготовлена з натуральної шкіри високої якості, що забезпечує
                довговічність та комфорт у будь-яку погоду.
            </p>
        </div>
    );
};

export default ProductDetails;