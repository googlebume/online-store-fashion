import React, { useState, useEffect } from "react";
import FilterCategorys from "./FilterCategorys";
import PriceWidget from "./PriceWidget";
import FilterColors from "./FilterColors";
import { exportFilteredProducts, getAllProducts } from '../../../../services/shop/src/state/productsData';
import { getUpdatedCategories, getUpdatedColors, subscribeToCategories, subscribeToColors } from '../state/filtersState';

const FiltersStickyBar = () => {
    const [allProducts, setAllProducts] = useState(getAllProducts());
    const [updatedCategories, setUpdatedCategoriesState] = useState(getUpdatedCategories());
    const [selectedColors, setSelectedColors] = useState(getUpdatedColors());
    const [selectedPriceRange, setSelectedPriceRange] = useState(null);

    useEffect(() => {
        const unsubscribeCategories = subscribeToCategories(setUpdatedCategoriesState);
        const unsubscribeColors = subscribeToColors(setSelectedColors);

        return () => {
            unsubscribeCategories();
            unsubscribeColors();
        };
    }, []);

    function applyFilters() {
        let filtered = [...allProducts];
        console.log("Продукти до фільтрації:", filtered);
    
        if (updatedCategories.length > 0) {
            console.log("Фільтрація по категоріях:", updatedCategories);
            filtered = filtered.filter(
                (item) => updatedCategories.includes(item.attributes.category) || updatedCategories.includes(item.attributes.type)
            );
            console.log("Продукти після фільтрації по категоріях:", filtered);
        }
    
        if (selectedColors.length > 0) {
            console.log("Фільтрація по кольору:", selectedColors);
            filtered = filtered.filter(
                (item) => selectedColors.includes(item.attributes.color)
            );
            console.log("Продукти після фільтрації по кольору:", filtered);
        }
    
        console.log("Результат фільтрації:", filtered);
        return filtered;
    }
    

    useEffect(() => {
        if (allProducts.length === 0) {
            console.log("📢 allProducts порожній, пропускаємо фільтрацію");
            return;
        }

        const filtered = applyFilters();
        console.warn(filtered)
        exportFilteredProducts(filtered);
        console.log("📢 updatedCategories:", updatedCategories);
        console.log("📢 selectedColors:", selectedColors);
        console.log("📢 `exportFilteredProducts` після фільтрації:", filtered);
    }, [allProducts, updatedCategories, selectedColors]);

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





// import React, { useState, useEffect } from "react";
// import FilterCategorys from "./FilterCategorys";
// import PriceWidget from "./PriceWidget";
// import FilterColors from "./FilterColors";

// import {
//     exportFilteredProducts,
//     onProductsReady
// } from '../../../../services/shop/src/state/productsData';

// import {
//     getUpdatedCategories,
//     getUpdatedColors,
//     subscribeToCategories,
//     subscribeToColors
// } from '../state/filtersState';

// const FiltersStickyBar = () => {
//     const [allProducts, setAllProducts] = useState([]);
//     const [updatedCategories, setUpdatedCategoriesState] = useState(getUpdatedCategories());
//     const [selectedColors, setSelectedColors] = useState(getUpdatedColors());
//     const [selectedPriceRange, setSelectedPriceRange] = useState(null);

//     // ✅ Завантажуємо продукти, коли будуть готові
//     useEffect(() => {
//         onProductsReady((loadedProducts) => {
//             setAllProducts(loadedProducts);

//             // Одразу запускаємо фільтрацію
//             const filtered = applyFilters(loadedProducts, updatedCategories, selectedColors);
//             exportFilteredProducts(filtered);
//             console.log("📢 `exportFilteredProducts` після фільтрації (onReady):", filtered);
//         });
//     }, []);

//     // ✅ Підписка на зміни в категоріях/кольорах
//     useEffect(() => {
//         const unsubscribeCategories = subscribeToCategories(setUpdatedCategoriesState);
//         const unsubscribeColors = subscribeToColors(setSelectedColors);
//         return () => {
//             unsubscribeCategories();
//             unsubscribeColors();
//         };
//     }, []);

//     // 🔁 Коли змінюються фільтри — перераховуємо фільтрацію (якщо вже є продукти)
//     useEffect(() => {
//         if (allProducts.length === 0) return;

//         const filtered = applyFilters(allProducts, updatedCategories, selectedColors);
//         exportFilteredProducts(filtered);
//         console.log("📢 `exportFilteredProducts` після зміни фільтрів:", filtered);
//     }, [updatedCategories, selectedColors]);

//     function applyFilters(products, categories, colors) {
//         let filtered = [...products];

//         if (categories.length > 0) {
//             filtered = filtered.filter(
//                 (item) => categories.includes(item.category) || categories.includes(item.type)
//             );
//         }

//         if (colors.length > 0) {
//             filtered = filtered.filter((item) => colors.includes(item.color));
//         }

//         // if (selectedPriceRange) {
//         //     filtered = filtered.filter(
//         //         (item) => item.price >= selectedPriceRange.min && item.price <= selectedPriceRange.max
//         //     );
//         // }

//         return filtered;
//     }

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
