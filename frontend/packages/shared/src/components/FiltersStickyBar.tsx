import React, { useState, useEffect } from "react";
import cl from '@packages/shared/src/utils/styles/modules/FiltersStickyBar.module.scss';
import FilterCategorys from "./FilterCategorys";
import PriceWidget from "./PriceWidget";
import FilterColors from "./FilterColors";
import { ProductType } from "@/utils/types/prosuctData.type";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@packages/shared/src/store";
import { filteredProductsActions } from "@packages/shared/src/store";

function FiltersStickyBar() {
  const dispatch = useDispatch();
  const allProducts = useSelector((state: RootState) => state.products.products);

  const [updatedCategories, setUpdatedCategoriesState] = useState([]);
  const [updatedTypes, setUpdatedTypesState] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<{minPrice: number, maxPrice: number}>();

  function applyFiltersForProducts(products: ProductType[]) {
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
    dispatch(filteredProductsActions.setFilteredProducts(filtered));
  }, [allProducts, updatedCategories, updatedTypes, selectedColors, selectedPriceRange, dispatch]);

  return (
    <aside className={cl.aside}>
      <FilterCategorys setUpdatedCategoriesState={setUpdatedCategoriesState} setUpdatedTypesState={setUpdatedTypesState} />
      <PriceWidget setSelectedPriceRange={setSelectedPriceRange} />
      <FilterColors setSelectedColors={setSelectedColors} />
    </aside>
  );
}

export default FiltersStickyBar;



