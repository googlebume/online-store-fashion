import React from 'react';
import cl from '@/utils/styles/ReviewStats.module.scss'

const ReviewStats = () => {
    return (
        <div className={cl.reviewStats}>
            <div className={cl.ratingSummary}>
                <div className={cl.averageRating}>4.8</div>
                <div className={cl.ratingDetails}>
                    <div className={cl.ratingStars}>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star-half-alt"></i>
                    </div>
                    <div className={cl.ratingLabel}>Середня оцінка</div>
                </div>
            </div>
            <div className={cl.ratingBars}>
                <div className={cl.ratingBar}>
                    <span>5</span>
                    <i className="fas fa-star"></i>
                    <div className={cl.barContainer}>
                        <div className={cl.barFill} style={{ width: '80%' }}></div>
                    </div>
                    <span>34</span>
                </div>
                {/* Додаткові рейтингові шкали */}
            </div>
        </div>
    );
};

export default ReviewStats;