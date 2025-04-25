import React, { useEffect, useState } from "react";
import {api} from '@packages/shared/src/routes/api'
import cl from '@/utils/styles/modules/ProductShopList.module.scss'
import ProductCard from "@packages/shared/src/components/ProductCard";
import { exportProducts, getFilteredProducts, subscribeToFilteredProducts } from "../state/productsData";

const ProductShopList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState(getFilteredProducts());

    useEffect(() => {
        fetch(`http://localhost:5000/${api}/shop`)
            .then((response) => response.json())
            .then((data) => {
                setProducts(data); 
                exportProducts(data);
            })
            .catch(error => console.error("Error fetching products:", error));
    }, []);

    useEffect(() => {
        const unsubscribe = subscribeToFilteredProducts(setFilteredProducts);
        return () => unsubscribe(); // Відписка при демонтажі
    }, []);

    return (
        <section className={cl.ProductShopList} >
            {(filteredProducts.length > 0 ? filteredProducts : products).map((card) => (
                <ProductCard
                    key={card.name}
                    name={`${card.name}`}
                    price={`${card.price}`}
                    discount={`${card.discount}`}
                    image={card.image}
                />
            ))}
        </section>
    );
};

export default ProductShopList;
