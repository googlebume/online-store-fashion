import React, { useEffect, useMemo } from "react";
import cl from "@/utils/styles/modules/ProductShopList.module.scss";
import ProductCard from "@packages/shared/src/components/ProductCard";
import { useFetch } from "@packages/shared/src/utils/hooks/useFetch";
import { ProductType } from "@packages/shared/src/utils/types/prosuctData.type";
import { batch, useDispatch, useSelector } from "react-redux";
import type { RootState } from "@packages/shared/src/store";
import { filteredProductsActions, productsActions } from "@packages/shared/src/store";
import { trackAnalytics } from "@packages/shared/src/utils/analytics/trackAnalytics";
import { getProductServiceBaseUrl } from "@packages/shared/src/utils/api/productServiceUrl";
import { ECOMMERCE_CURRENCY, toGa4Item } from "@packages/shared/src/utils/analytics/ecommercePayload";
import {
    logFilterPipeline,
    pickProductAttr,
} from "@packages/shared/src/utils/debug/filterPipelineLog";

const ProductShopList = () => {
    const dispatch = useDispatch();
    const products = useSelector((state: RootState) => state.products.products);
    const filteredProducts = useSelector(
        (state: RootState) => state.filteredProducts.filteredProducts
    );
    const filtersActive = useSelector(
        (state: RootState) => state.filteredProducts.filtersActive
    );

    const { response, error, fetchData } = useFetch<null, {meta:any, loaded:ProductType[]}>();

    useEffect(() => {
        fetchData({
            method: 'POST',
            url: 'shop-dynamically',
            baseUrl: getProductServiceBaseUrl(),
            body: {
                take: 20,
                page: 0
            }
        });
    }, []);

    useEffect(() => {
        if (response && Array.isArray(response.loaded)) {
            const loaded = response.loaded;
            logFilterPipeline("ProductShopList → API shop-dynamically → setProducts", {
                loadedCount: loaded.length,
                sample: loaded.slice(0, 5).map((p) => ({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    attr: pickProductAttr(p),
                })),
            });
            batch(() => {
                dispatch(productsActions.setProducts(loaded));
                dispatch(filteredProductsActions.clearFilteredProducts());
            });
            trackAnalytics({
                name: 'view_item_list',
                payload: {
                    item_list_id: 'shop_main',
                    item_list_name: 'Каталог',
                    currency: ECOMMERCE_CURRENCY,
                    productCount: loaded.length,
                    items: loaded.slice(0, 50).map((p) => ({
                        ...toGa4Item(p, 1),
                        item_list_id: 'shop_main',
                        item_list_name: 'Каталог',
                    })),
                },
            });
        }
    }, [dispatch, response]);

    const list = useMemo(
        () => (filtersActive ? filteredProducts : products),
        [filtersActive, filteredProducts, products]
    );

    useEffect(() => {
        logFilterPipeline("ProductShopList → list resolved", {
            filtersActive,
            reduxProductsCount: products.length,
            reduxFilteredCount: filteredProducts.length,
            listLength: list.length,
            source: filtersActive ? "filteredProducts" : "products",
            firstIds: list.slice(0, 8).map((p) => p.id),
        });
    }, [filtersActive, filteredProducts.length, list, products.length]);

    const apiOrigin = getProductServiceBaseUrl();

    return (
        <section className={cl.ProductShopList}>
            {error ? (
                <div className={cl.catalogError} role="alert">
                    <strong>Не вдалося завантажити каталог.</strong>
                    <p>
                        Перевірте, що запущено product-service на{' '}
                        <code>{apiOrigin}</code> (за замовчуванням порт 5002).
                    </p>
                    <p className={cl.catalogErrorHint}>
                        З кореня бекенду: <code>npm run start:productService</code>
                        або повний стек: <code>npm run start:dev</code>
                    </p>
                    <p className={cl.catalogErrorTech}>{error.message}</p>
                </div>
            ) : null}
            {!error &&
                list.map((card) => (
                    <ProductCard key={card.id} data={card} />
                ))}
        </section>
    );
};

export default ProductShopList;


