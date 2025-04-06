import React from 'react';
import {productRoutes} from '@packages/shared/src/routes/product'
import {Link} from "react-router-dom";

const Product = () => {
    return (
        <h1>
            HEADER
            <div>
                <Link to={productRoutes.result}>go to second page</Link>
            </div>
        </h1>
    );
};

export default Product;