import React, { useEffect, useState } from 'react';
import { api } from '@packages/shared/src/routes/api'
import cl from '@/utils/styles/modules/ProductsRelated.module.scss'
import ProductCard from '@packages/shared/src/components/ProductCard'
import { ProductType } from '@packages/shared/src/utils/types/prosuctData.type';
import { useLocation, useParams } from 'react-router-dom';
import ViewAllProductsCard from './UI/ViewAllProductsCard/ViewAllProductsCard';

const ProductsRelated = () => {

    const [mightlikeProducts, setMightlikeProducts] = useState<ProductType[]>();
    const [prevLocation, setPrevLocation] = useState<string>('')

    useEffect(() => {
        fetch(`http://localhost:5000/${api}/shop/product`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setMightlikeProducts(data);
            })
    }, [])

    useEffect(() => {
        setPrevLocation(window.location.pathname);
    }, [window.location.pathname])

    return (
        <section className={cl.relatedProducts}>
            <div className={cl.relatedBody}>
                <h2 className={cl.sectionTitle}>Схожі товари</h2>
                <div className={cl.cards}>
                    {mightlikeProducts && mightlikeProducts.map((product) => (
                        <ProductCard 
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