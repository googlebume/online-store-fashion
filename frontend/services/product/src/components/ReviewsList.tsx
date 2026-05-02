import React from 'react';
import cl from '@/utils/styles/modules/ReviewsList.module.scss';
import ReviewElement from './UI/ReviewElement/ReviewElement';
import type { ProductReviewItem } from '@/types/reviews.types';
import { formatRelativeTimeUk } from '@/utils/formatRelativeTimeUk';

type Props = {
  reviews: ProductReviewItem[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
};

const ReviewsList: React.FC<Props> = ({ reviews, isLoading, hasMore, onLoadMore }) => {
  if (!isLoading && reviews.length === 0) {
    return (
      <div className={cl.reviewsList}>
        <p style={{ textAlign: 'center', opacity: 0.75 }}>Ще ніхто не залишив відгук — будьте першими.</p>
      </div>
    );
  }

  return (
    <div className={cl.reviewsList}>
      {reviews.map((r) => (
        <ReviewElement
          key={r.id}
          starCount={r.stars}
          userName={r.userName}
          datePuplished={formatRelativeTimeUk(r.createdAt)}
          review={r.text}
        />
      ))}
      {hasMore && (
        <button type="button" className={cl.loadMoreButton} onClick={onLoadMore} disabled={isLoading}>
          {isLoading ? 'Завантаження…' : 'Показати більше'}
        </button>
      )}
    </div>
  );
};

export default ReviewsList;
