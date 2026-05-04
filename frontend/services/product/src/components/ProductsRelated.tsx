import React, { useEffect, useState } from 'react';
import { api } from '@packages/shared/src/routes/api'
import { getProductServiceBaseUrl } from '@packages/shared/src/utils/api/productServiceUrl';
import cl from '@/utils/styles/modules/ProductsRelated.module.scss'
import ProductCard from '@packages/shared/src/components/ProductCard'
import { ProductType } from '@packages/shared/src/utils/types/prosuctData.type';
import ViewAllProductsCard from './UI/ViewAllProductsCard/ViewAllProductsCard';

const ProductsRelated = () => {

    const [mightlikeProducts, setMightlikeProducts] = useState<ProductType[]>();

    useEffect(() => {
        fetch(`${getProductServiceBaseUrl()}/${api}/shop/product`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setMightlikeProducts(data);
            })
    }, [])

    return (
        <section className={cl.relatedProducts}>
            <div className={cl.relatedBody}>
                <h2 className={cl.sectionTitle}>Схожі товари</h2>
                <div className={cl.cards}>
                    {mightlikeProducts && mightlikeProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            data={product}
                        />
                    ))}
                    <ViewAllProductsCard />
                </div>
            </div>
        </section>
    );
};

export default ProductsRelated;