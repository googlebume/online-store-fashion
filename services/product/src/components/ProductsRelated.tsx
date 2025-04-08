import React from 'react';
import cl from '@/utils/styles/ProductsRelated.module.scss'
import ProductCard from '@packages/shared/src/components/ProductCard'

const ProductsRelated = () => {
    return (
        <section className={cl.relatedProducts}>
            <h2 className={cl.sectionTitle}>Схожі товари</h2>
            <div className={cl.productsGrid}>
                <div className={cl.productCard}>
                    <div className={cl.productImageContainer}>
                        <img
                            src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=736&q=80"
                            alt="Leather Biker Jacket"
                            className={cl.productImage}
                        />
                        <div className={cl.productBadge}>NEW</div>
                    </div>
                    <div className={cl.productInfo}>
                        <h3 className={cl.productName}>Куртка байкера</h3>
                        <div className={cl.productPriceContainer}>
                            <span className={cl.productPrice}>₴3,799</span>
                            <span className={cl.productOldPrice}>₴4,299</span>
                            <button className={cl.favoriteButton}>
                                <i className="far fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
                {/* Додаткові товари можна додати аналогічно */}
            </div>
        </section>
    );
};

export default ProductsRelated;