import React from 'react';
import cl from './ProductTitle.module.scss';
import useStarsRating from '@/utils/hooks/useStarsRating';

const ProductTitle = ({ title }: { title: string }) => {
  const renderStars = useStarsRating(cl); // Отримуємо функцію renderStars

  return (
    <>
      <h1 className={cl.productTitle}>{title}</h1>
      <div className={cl.raitContainer}>
        <span className={cl.rait}>{renderStars(5)}</span> <span>(32 відгуки)</span>
      </div>
    </>
  );
};

export default ProductTitle;