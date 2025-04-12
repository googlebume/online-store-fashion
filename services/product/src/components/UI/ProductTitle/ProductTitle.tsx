import React from 'react';
import cl from './ProductTitle.module.scss'

const ProductTitle = ({title}:{title: string}) => {
    return (
        <h1 className={cl.productTitle}>{title}</h1>
    );
};

export default ProductTitle;