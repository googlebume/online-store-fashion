import React, { ReactNode } from 'react';
import cl from './ProductDescription.module.scss'

type DescriptionPropsType = {
    children: ReactNode;
  };

const ProductDescription: React.FC<DescriptionPropsType> = ({children}) => {
    return (
        <p className={cl.productDescription}>
            {children}
        </p>
    );
};

export default ProductDescription;