// import React, { useState, useEffect } from "react";
// import FilterCategorys from "./FilterCategorys";
// import PriceWidget from "./PriceWidget";
// import FilterColors from "./FilterColors";

// import { exportFilteredProducts, getAllProducts } from '../../../../services/shop/src/state/productsData'
// import { getUpdatedCategories } from '../state/filtersState'

// const FiltersStickyBar = () => {
//     // const [filteredProductsReturn, setfilteredProductsReturn] = useState();
//     // setfilteredProductsReturn(getAllProducts().filter(item => item.category && item.type == getUpdatedCategories ));
//     // exportFilteredProducts(filteredProductsReturn);

//     const [filteredProductsReturn, setFilteredProductsReturn] = useState([]);
//     console.log('all prod ', getAllProducts())
//     useEffect(() => {
//         const updatedCategories = getUpdatedCategories();

//         const filtered = getAllProducts().filter(
//             (item) => item.category && updatedCategories.includes(item.type)
//         );

//         setFilteredProductsReturn(filtered);
//         exportFilteredProducts(filtered);
//         console.log(`exportFilteredProducts `, filtered)
//     }, [getUpdatedCategories()]);


//     return (
//         <aside
//             style={{
//                 maxWidth: "292px",
//                 maxHeight: "max-content",
//                 position: "sticky",
//                 top: "75px",
//                 margin: "0 8px 0 0",
//             }}
//         >
//             <FilterCategorys />
//             <PriceWidget />
//             <FilterColors />
//         </aside>
//     );
// };

// export default FiltersStickyBar;



import React, { useState, useEffect } from "react";
import FilterCategorys from "./FilterCategorys";
import PriceWidget from "./PriceWidget";
import FilterColors from "./FilterColors";

import { exportFilteredProducts, getAllProducts } from '../../../../services/shop/src/state/productsData';
import { getUpdatedCategories, subscribeToCategories } from '../state/filtersState';

const FiltersStickyBar = () => {
    const [filteredProductsReturn, setFilteredProductsReturn] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [updatedCategories, setUpdatedCategoriesState] = useState(getUpdatedCategories());

    // Отримання всіх продуктів при монтуванні компонента
    useEffect(() => {
        const products = getAllProducts();
        if (products.length > 0) {
            setAllProducts(products);
        }
    }, []);

    // Підписка на зміни категорій
    useEffect(() => {
        const unsubscribe = subscribeToCategories(setUpdatedCategoriesState);
        return () => unsubscribe(); // Відписка при демонтажі компонента
    }, []);

    // Фільтрація продуктів при зміні категорій або списку продуктів
    useEffect(() => {
        if (allProducts.length === 0) return;

        const filtered = allProducts.filter(
            (item) => updatedCategories.includes(item.category) || updatedCategories.includes(item.type)
        );

        setFilteredProductsReturn(filtered);
        exportFilteredProducts(filtered);
        console.log("📢 `exportFilteredProducts` після фільтрації:", filtered);
    }, [allProducts, updatedCategories]);

    return (
        <aside
            style={{
                maxWidth: "292px",
                maxHeight: "max-content",
                position: "sticky",
                top: "75px",
                margin: "0 8px 0 0",
            }}
        >
            <FilterCategorys />
            <PriceWidget />
            <FilterColors />
        </aside>
    );
};

export default FiltersStickyBar;

