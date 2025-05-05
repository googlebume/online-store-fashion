import React, { useState, useEffect } from "react";
import cl from '@packages/shared/src/utils/styles/modules/FiltersStickyBar.module.scss'
import FilterCategorys from "./FilterCategorys";
import PriceWidget from "./PriceWidget";
import FilterColors from "./FilterColors";
import { exportFilteredProducts, getAllProducts } from '../../../../services/shop/src/state/productsData';
import { getUpdatedCategories, getUpdatedColors, subscribeToCategories, subscribeToColors } from '../state/filtersState';

const FiltersStickyBar = () => {
    const [allProducts, setAllProducts] = useState(getAllProducts());
    const [updatedCategories, setUpdatedCategoriesState] = useState(getUpdatedCategories());
    const [selectedColors, setSelectedColors] = useState(getUpdatedColors());
    const [selectedPriceRange, setSelectedPriceRange] = useState();

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
        if (selectedPriceRange) {
            console.log("Фільтрація по ціні:", selectedPriceRange);
            filtered = filtered.filter(
                (item) => item.price <= selectedPriceRange.maxPrice && item.price >= selectedPriceRange.minPrice
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
    }, [allProducts, updatedCategories, selectedColors, selectedPriceRange]);

    return (
        <aside
            className={cl.aside}
        >
            <FilterCategorys />
            <PriceWidget setSelectedPriceRange={setSelectedPriceRange}/>
            <FilterColors />
        </aside>
    );
};

export default FiltersStickyBar;
