import React from 'react';
import cl from '@/utils/styles/ReviewsSection.module.scss'
import ReviewStats from './ReviewStats';
import ReviewAdd from './ReviewAdd';
import ReviewsList from './ReviewsList';

const ReviewsSection = () => {
    return (
        <section className={cl.reviewsSection}>
            <h2 className={cl.sectionTitle}>Відгуки (42)</h2>
            <div className={cl.reviewsLayout}>
                {/* Review Stats */}
                <ReviewStats />

                {/* Add Review */}
                <ReviewAdd />
            </div>

            {/* Reviews List */}
            <ReviewsList />
        </section>
    );
};

export default ReviewsSection;