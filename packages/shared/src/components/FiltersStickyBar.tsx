import React, { useState, useEffect } from "react";
import cl from '@packages/shared/src/utils/styles/modules/FiltersStickyBar.module.scss';
import FilterCategorys from "./FilterCategorys";
import PriceWidget from "./PriceWidget";
import FilterColors from "./FilterColors";
import { exportFilteredProducts, getAllProducts, subscribeToProducts } from '../../../../services/shop/src/state/productsData';
import { getUpdatedCategories, getUpdatedColors, subscribeToCategories, subscribeToColors } from '../state/filtersState';
import { ProductType } from "@/utils/types/prosuctData.type";

function FiltersStickyBar() {
  const [allProducts, setAllProducts] = useState(getAllProducts());
  useEffect(() => {
    const unsubscribe = subscribeToProducts((products) => {
      setAllProducts(products);
    });
    setAllProducts(getAllProducts());
    return () => unsubscribe();
  }, []);

  const [updatedCategories, setUpdatedCategoriesState] = useState([]);
  const [updatedTypes, setUpdatedTypesState] = useState([]);
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

  function applyFiltersForProducts(products) {
    let filtered = [...products];
    if (updatedCategories.length > 0) {
      filtered = filtered.filter(
        (item) => {
          const attr = Array.isArray(item.attributes) ? item.attributes[0] : item.attributes;
          const res = attr && updatedCategories.includes(attr.category);
          return res;
        }
      );
    }
    if (updatedTypes.length > 0) {
      filtered = filtered.filter(
        (item) => {
          const attr = Array.isArray(item.attributes) ? item.attributes[0] : item.attributes;
          const res = attr && updatedTypes.includes(attr.type);
          return res;
        }
      );
    }
    if (selectedColors.length > 0) {
      filtered = filtered.filter(
        (item) => {
          const attr = Array.isArray(item.attributes) ? item.attributes[0] : item.attributes;
          const res = attr && selectedColors.includes(attr.color);
          return res;
        }
      );
    }
    if (selectedPriceRange) {
      filtered = filtered.filter(
        (item) => {
          const res = item.price >= selectedPriceRange.minPrice && item.price <= selectedPriceRange.maxPrice;
          return res;
        }
      );
    }
    return filtered;
  }

  function applyFilters() {
    return applyFiltersForProducts(allProducts);
  }

  useEffect(() => {
    const filtered = applyFilters();
    exportFilteredProducts(filtered);
  }, [allProducts, updatedCategories, updatedTypes, selectedColors, selectedPriceRange]);

  return (
    <aside className={cl.aside}>
      <FilterCategorys setUpdatedCategoriesState={setUpdatedCategoriesState} setUpdatedTypesState={setUpdatedTypesState} />
      <PriceWidget setSelectedPriceRange={setSelectedPriceRange} />
      <FilterColors setSelectedColors={setSelectedColors} />
    </aside>
  );
}

export default FiltersStickyBar;
