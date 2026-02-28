import React, { useEffect, useState } from "react";
import { api } from "@packages/shared/src/routes/api";
import cl from "@/utils/styles/modules/ProductShopList.module.scss";
import ProductCard from "@packages/shared/src/components/ProductCard";
import { exportProducts, getFilteredProducts, subscribeToFilteredProducts } from "../state/productsData";
import { useFetch } from "@packages/shared/src/utils/hooks/useFetch";
import { ProductType } from "@packages/shared/src/utils/types/prosuctData.type";

const ProductShopList = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [filteredProducts, setFilteredProducts] = useState(getFilteredProducts());


    const { response, error, isLoading, fetchData } = useFetch<null, {meta:any, loaded:ProductType[]}>();

    useEffect(() => {
        fetchData({
            method: 'POST',
            url: 'shop-dynamically',
            port: 5000,
            body: {
                take: 20,
                page: 0
            }
        });
    }, []);

    useEffect(() => {
        if (response && Array.isArray(response.loaded)) {
            setProducts(response.loaded);
            exportProducts(response.loaded);
            console.log("   ddd ",response.loaded)
        }
    }, [response]);

    useEffect(() => {
        const unsubscribe = subscribeToFilteredProducts(setFilteredProducts);
        return () => unsubscribe();
    }, []);

    return (
        <section className={cl.ProductShopList}>
            {(filteredProducts.length > 0 ? filteredProducts : products).map((card) => (
                <ProductCard
                    key={card.name}
                    data={card}
                />
            ))}
        </section>
    );
};

export default ProductShopList;


