import React, { useEffect } from "react";
import cl from "@/utils/styles/modules/ProductShopList.module.scss";
import ProductCard from "@packages/shared/src/components/ProductCard";
import { useFetch } from "@packages/shared/src/utils/hooks/useFetch";
import { ProductType } from "@packages/shared/src/utils/types/prosuctData.type";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@packages/shared/src/store";
import { filteredProductsActions, productsActions } from "@packages/shared/src/store";

const ProductShopList = () => {
    const dispatch = useDispatch();
    const products = useSelector((state: RootState) => state.products.products);
    const filteredProducts = useSelector(
        (state: RootState) => state.filteredProducts.filteredProducts
    );

    const { response, fetchData } = useFetch<null, {meta:any, loaded:ProductType[]}>();

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
            dispatch(productsActions.setProducts(response.loaded));
            dispatch(filteredProductsActions.clearFilteredProducts());
        }
    }, [dispatch, response]);

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


