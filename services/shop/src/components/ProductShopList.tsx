// import React, { useEffect, useState } from "react";
// import {api} from '@packages/shared/src/routes/api'
// import cl from '@/utils/styles/modules/ProductShopList.module.scss'
// import ProductCard from "@packages/shared/src/components/ProductCard";
// import { exportProducts, getFilteredProducts, subscribeToFilteredProducts } from "../state/productsData";
// import { useFetch } from "@packages/shared/src/utils/hooks/useFetch";
// import { ProductType } from '@packages/shared/src/utils/types/prosuctData.type'

// const ProductShopList = () => {
//     const [products, setProducts] = useState([]);
//     const [filteredProducts, setFilteredProducts] = useState(getFilteredProducts());
//     const {response, error, isLoading, fetchData} = useFetch<ProductType>([]);
//     // useEffect(() => {
//     //     fetch(`http://localhost:5000/${api}/shop`)
//     //         .then((response) => response.json())
//     //         .then((data) => {
//     //             setProducts(data); 
//     //             exportProducts(data);
//     //         })
//     //         .catch(error => console.error("Error fetching products:", error));
//     // }, []);
//     useEffect(() => {
//         fetchData({
//             method: 'GET',
//             url: 'shop',
//             port: 5000
//         })
//         if (response.length > 0) {
//             setProducts(data);
//             exportProducts(data);
//         }
//     })
    


//     useEffect(() => {
//         const unsubscribe = subscribeToFilteredProducts(setFilteredProducts);
//         return () => unsubscribe(); // Відписка при демонтажі
//     }, []);

//     return (
//         <section className={cl.ProductShopList} >
//             {(filteredProducts.length > 0 ? filteredProducts : products).map((card) => (
//                 <ProductCard
//                     key={card.name}
//                     name={`${card.name}`}
//                     price={`${card.price}`}
//                     discount={`${card.discount}`}
//                     image={card.image}
//                 />
//             ))}
//         </section>
//     );
// };

// export default ProductShopList;


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

    
    const { response, error, isLoading, fetchData } = useFetch<null, ProductType[]>();

    useEffect(() => {
        fetchData({
            method: 'GET',
            url: 'shop',
            port: 5000,
        });
    }, []);

    useEffect(() => {
        if (response && Array.isArray(response)) {
            setProducts(response);
            exportProducts(response);
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
