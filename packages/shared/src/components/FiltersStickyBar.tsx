import React, { useState, useEffect } from "react";
import cl from '@packages/shared/src/utils/styles/modules/FiltersStickyBar.module.scss';
import FilterCategorys from "./FilterCategorys";
import PriceWidget from "./PriceWidget";
import FilterColors from "./FilterColors";
import { exportFilteredProducts, getAllProducts } from '../../../../services/shop/src/state/productsData';
import { getUpdatedCategories, getUpdatedColors, subscribeToCategories, subscribeToColors } from '../state/filtersState';
import { ProductType } from "@/utils/types/prosuctData.type";

type PriceRange = {
  minPrice: number;
  maxPrice: number;
};

const FiltersStickyBar: React.FC = () => {
  const [allProducts, setAllProducts] = useState<ProductType[]>(getAllProducts());
  console.log("fbp", allProducts)
  const [updatedCategories, setUpdatedCategoriesState] = useState<string[]>(getUpdatedCategories());
  const [selectedColors, setSelectedColors] = useState<string[]>(getUpdatedColors());
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange | undefined>(undefined);

  useEffect(() => {
    const unsubscribeCategories = subscribeToCategories(setUpdatedCategoriesState);
    const unsubscribeColors = subscribeToColors(setSelectedColors);
    return () => {
      unsubscribeCategories();
      unsubscribeColors();
    };
  }, []);

  function applyFilters(): ProductType[] {
    let filtered = [...allProducts];

    if (updatedCategories.length > 0) {
      filtered = filtered.filter(
        (item) =>
          updatedCategories.includes(item.attributes.category) ||
          updatedCategories.includes(item.attributes.type)
      );
    }

    if (selectedColors.length > 0) {
      filtered = filtered.filter((item) => selectedColors.includes(item.attributes.color));
    }

    if (selectedPriceRange) {
      filtered = filtered.filter(
        (item) =>
          item.price >= selectedPriceRange.minPrice &&
          item.price <= selectedPriceRange.maxPrice
      );
    }

    return filtered;
  }

  useEffect(() => {
    if (allProducts.length === 0) return;
    const filtered = applyFilters();
    exportFilteredProducts(filtered);
  }, [allProducts, updatedCategories, selectedColors, selectedPriceRange]);

  return (
    <aside className={cl.aside}>
      <FilterCategorys />
      <PriceWidget setSelectedPriceRange={setSelectedPriceRange} />
      <FilterColors />
    </aside>
  );
};

export default FiltersStickyBar;
