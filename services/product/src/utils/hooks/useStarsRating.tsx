import { useMemo } from 'react';

const useStarsRating = (styles: any) => {
  const renderStars = useMemo(() => {
    return (rating: number) => {
      let stars = [];
      for (let i = 1; i <= 5; i++) {
        stars.push(
          <span 
            key={i} 
            className={`${styles.star} ${i <= rating ? styles.filled : ''}`}
          >
            ★
          </span>
        );
      }
      return stars;
    };
  }, [styles]);

  return renderStars;
};

export default useStarsRating;