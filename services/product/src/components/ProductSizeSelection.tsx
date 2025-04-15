import React, { useState } from 'react';
import cl from '@/utils/styles/ProductSizeSelection.module.scss';

const ProductSizeSelection = () => {
  const [selectedSize, setSelectedSize] = useState('M');

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  const handleSizeChange = (size:string) => {
    setSelectedSize(size);
  };

  return (
    <div className={cl.sizeSelection}>
      <div className={cl.sizeHeader}>
        <h3 className={cl.sizeTitle}>Розмір:</h3>
        <a
          href="https://3cm.com.ua/image/catalog/1_%D0%9A%D0%B0%D1%82%D0%B5%D0%B3%D0%BE%D1%80%D0%B8%D0%B8/Tabl_Size_800x600_ukr.png"
          className={cl.sizeGuideLink}
        >
          Таблиця розмірів
        </a>
      </div>
      <div className={cl.sizeOptions}>
        {sizes.map((size) => (
          <label
            key={size}
            className={`${cl.sizeLabel} ${selectedSize === size ? cl.selected : ''}`}
          >
            <input
              type="radio"
              name="size"
              value={size}
              checked={selectedSize === size}
              onChange={() => handleSizeChange(size)}
              className={cl.sizeInput}
            />
            {size}
          </label>
        ))}
      </div>
    </div>
  );
};

export default ProductSizeSelection;