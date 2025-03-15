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

    // Отримання всіх продуктів при монтуванні компонента
    useEffect(() => {
        if (allProducts.length > 0) {
            setAllProducts(allProducts);
        }
    }, []);

    // Підписка на зміни категорій
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

        if (updatedCategories.length > 0) {
            filtered = filtered.filter(
                (item) => updatedCategories.includes(item.category) || updatedCategories.includes(item.type)
            );
        }

        if (selectedColors.length > 0) {
            filtered = filtered.filter(
                (item) => selectedColors.includes(item.color)
            );
        }

        // if (selectedPriceRange) {
        //     filtered = filtered.filter(
        //         (item) => item.price >= selectedPriceRange.min && item.price <= selectedPriceRange.max
        //     );
        // }

        return filtered;
    }

    useEffect(() => {
        if (allProducts.length === 0) return;

        const filtered = applyFilters();
        exportFilteredProducts(filtered);
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