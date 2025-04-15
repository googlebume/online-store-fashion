import React from 'react';
import cl from './ReviewElement.module.scss'
import useStarsRating from '@/utils/hooks/useStarsRating';

type ReviewType = {
    starCount: number;
    userName: string;
    datePuplished: string;
    review: string;
}

const ReviewElement: React.FC<ReviewType> = ({starCount, userName, datePuplished, review}) => {
    const renderStars = useStarsRating(cl);
    
    return (
        <div className={cl.reviewItem}>
            <div className={cl.reviewHeader}>
                <div className={cl.reviewRating}>
                    {renderStars(starCount)}
                </div>
                <span className={cl.reviewerName}>{userName}</span>
                <span className={cl.reviewDate}>{datePuplished}</span>
            </div>
            <p className={cl.reviewText}>
                {review}
            </p>
        </div>
    );
};

export default ReviewElement;