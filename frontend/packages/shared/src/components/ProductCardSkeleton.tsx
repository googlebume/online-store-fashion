import React from 'react';
import cl from './ProductCardSkeleton.module.scss';

const ProductCardSkeleton: React.FC = () => (
  <article className={cl.skeleton}>
    <div className={cl.skeletonImg} />
    <div className={cl.skeletonBody}>
      <div className={cl.skeletonRow}>
        <div className={cl.skeletonPrice} />
        <div className={cl.skeletonBtn} />
      </div>
      <div className={cl.skeletonName} />
    </div>
  </article>
);

export default ProductCardSkeleton;
