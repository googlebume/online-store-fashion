import React from 'react';
import cl from '@/utils/styles/ReviewsList.module.scss'

const ReviewsList = () => {
    return (
        <div className={cl.reviewsList}>
            <div className={cl.reviewItem}>
                <div className={cl.reviewHeader}>
                    <div className={cl.reviewRating}>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                    </div>
                    <span className={cl.reviewerName}>Андрій</span>
                    <span className={cl.reviewDate}>2 тижні тому</span>
                </div>
                <p className={cl.reviewText}>
                    Дуже якісна куртка! Шкіра м'яка, але міцна. Підходить на всі пори року.
                </p>
            </div>
            <button className={cl.loadMoreButton}>Показати більше</button>
            {/* Додаткові відгуки */}
        </div>
    );
};

export default ReviewsList;