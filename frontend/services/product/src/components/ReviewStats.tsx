import React from 'react';
import cl from '@/utils/styles/modules/ReviewStats.module.scss';
import useStarsRating from '@/utils/hooks/useStarsRating';
import type { ProductReviewStats } from '@/types/reviews.types';

type Props = {
  stats: ProductReviewStats;
};

const ReviewStats: React.FC<Props> = ({ stats }) => {
  const renderStars = useStarsRating(cl);
  const total = stats.totalReviews;
  const avg = stats.averageRating ?? 0;
  const dist = stats.distribution ?? {};

  const countFor = (star: number) => {
    const n = dist[String(star)] ?? (dist as Record<number, number>)[star];
    return typeof n === 'number' ? n : 0;
  };

  const pct = (count: number) => (total > 0 ? Math.round((count / total) * 100) : 0);

  return (
    <div className={cl.reviewStats}>
      <div className={cl.ratingSummary}>
        <div className={cl.averageRating}>{avg.toFixed(1)}</div>
        <div className={cl.ratingDetails}>
          <div className={cl.ratingStars}>{renderStars(Math.round(avg))}</div>
          <div className={cl.ratingLabel}>Середня оцінка · {total} відгуків</div>
        </div>
      </div>
      <div className={cl.ratingBars}>
        {[5, 4, 3, 2, 1].map((star) => {
          const c = countFor(star);
          return (
            <div key={star} className={cl.ratingBar}>
              <span>{star}</span>
              <i className="fas fa-star"></i>
              <div className={cl.barContainer}>
                <div className={cl.barFill} style={{ width: `${pct(c)}%` }}></div>
              </div>
              <span>{c}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewStats;
