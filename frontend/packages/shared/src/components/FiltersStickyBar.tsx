import React, { useState, useEffect, useMemo } from "react";
import cl from '@packages/shared/src/utils/styles/modules/FiltersStickyBar.module.scss';
import FilterCategorys from "./FilterCategorys";
import PriceWidget from "./PriceWidget";
import FilterColors from "./FilterColors";
import { ProductType } from "@/utils/types/prosuctData.type";
import { batch, useDispatch, useSelector } from "react-redux";
import type { RootState } from "@packages/shared/src/store";
import { filteredProductsActions } from "@packages/shared/src/store";
import {
    isFilterPipelineDebug,
    logFilterPipeline,
    pickProductAttr,
} from "@packages/shared/src/utils/debug/filterPipelineLog";

type PriceRange = { minPrice: number; maxPrice: number };

/** Чиста функція — завжди узгоджена з поточним каталогом із Redux */
export function computeFilteredProducts(
    products: ProductType[],
    updatedCategories: string[],
    updatedTypes: string[],
    selectedColors: string[],
    selectedPriceRange: PriceRange | undefined
): ProductType[] {
    const debug = isFilterPipelineDebug();
    let filtered = [...products];

    if (debug) {
        const samples = products.slice(0, 5).map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            attributesIsArray: Array.isArray(p.attributes),
            attr: pickProductAttr(p),
        }));
        logFilterPipeline("computeFilteredProducts:START", {
            inputCount: products.length,
            criteria: {
                updatedCategories,
                updatedTypes,
                selectedColors,
                selectedPriceRange,
            },
            sampleProducts: samples,
        });
    }

    if (updatedCategories.length > 0) {
        const before = filtered.length;
        filtered = filtered.filter((item) => {
            const attr = pickProductAttr(item);
            const cat = attr?.category;
            return typeof cat === "string" && updatedCategories.includes(cat);
        });
        if (debug) {
            logFilterPipeline("step:category", {
                selected: updatedCategories,
                countBefore: before,
                countAfter: filtered.length,
            });
            if (filtered.length === 0 && before > 0) {
                const rejected = products.slice(0, 5).map((p) => ({
                    id: p.id,
                    category: pickProductAttr(p)?.category,
                }));
                logFilterPipeline("step:category — 0 matches (sample category values on catalog)", {
                    rejectedSample: rejected,
                });
            }
        }
    }
    if (updatedTypes.length > 0) {
        const poolBefore = filtered;
        const before = filtered.length;
        filtered = filtered.filter((item) => {
            const attr = pickProductAttr(item);
            const t = attr?.type;
            return typeof t === "string" && updatedTypes.includes(t);
        });
        if (debug) {
            logFilterPipeline("step:type", {
                selected: updatedTypes,
                countBefore: before,
                countAfter: filtered.length,
            });
            if (filtered.length === 0 && before > 0) {
                const rejected = poolBefore.slice(0, 5).map((p) => ({
                    id: p.id,
                    type: pickProductAttr(p)?.type,
                }));
                logFilterPipeline("step:type — 0 matches (sample type values before this step)", {
                    rejectedSample: rejected,
                });
            }
        }
    }
    if (selectedColors.length > 0) {
        const poolBefore = filtered;
        const before = filtered.length;
        filtered = filtered.filter((item) => {
            const attr = pickProductAttr(item);
            const c = attr?.color;
            return typeof c === "string" && selectedColors.includes(c);
        });
        if (debug) {
            logFilterPipeline("step:color", {
                selected: selectedColors,
                countBefore: before,
                countAfter: filtered.length,
            });
            if (filtered.length === 0 && before > 0) {
                const rejected = poolBefore.slice(0, 5).map((p) => ({
                    id: p.id,
                    color: pickProductAttr(p)?.color,
                }));
                logFilterPipeline("step:color — 0 matches (sample color values before this step)", {
                    rejectedSample: rejected,
                });
            }
        }
    }
    if (selectedPriceRange) {
        const poolBefore = filtered;
        const before = filtered.length;
        filtered = filtered.filter(
            (item) =>
                item.price >= selectedPriceRange.minPrice &&
                item.price <= selectedPriceRange.maxPrice
        );
        if (debug) {
            logFilterPipeline("step:price", {
                range: selectedPriceRange,
                countBefore: before,
                countAfter: filtered.length,
            });
            if (filtered.length === 0 && before > 0) {
                const prices = poolBefore.slice(0, 10).map((p) => p.price);
                logFilterPipeline("step:price — 0 matches (prices in pool before this step)", {
                    pricesSample: prices,
                });
            }
        }
    }

    if (debug) {
        logFilterPipeline("computeFilteredProducts:RESULT", {
            outputCount: filtered.length,
            outputIds: filtered.slice(0, 15).map((p) => p.id),
        });
    }

    return filtered;
}

function FiltersStickyBar() {
    const dispatch = useDispatch();
    const allProducts = useSelector((state: RootState) => state.products.products);

    const [updatedCategories, setUpdatedCategoriesState] = useState<string[]>([]);
    const [updatedTypes, setUpdatedTypesState] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange | undefined>(undefined);

    const filtered = useMemo(
        () =>
            computeFilteredProducts(
                allProducts,
                updatedCategories,
                updatedTypes,
                selectedColors,
                selectedPriceRange
            ),
        [allProducts, updatedCategories, updatedTypes, selectedColors, selectedPriceRange]
    );

    const filtersActive = useMemo(
        () =>
            updatedCategories.length > 0 ||
            updatedTypes.length > 0 ||
            selectedColors.length > 0 ||
            selectedPriceRange != null,
        [updatedCategories, updatedTypes, selectedColors, selectedPriceRange]
    );

    useEffect(() => {
        logFilterPipeline("FiltersStickyBar → dispatch", {
            allProductsCount: allProducts.length,
            filtersActive,
            filteredCount: filtered.length,
            criteria: {
                updatedCategories,
                updatedTypes,
                selectedColors,
                selectedPriceRange,
            },
        });
        batch(() => {
            dispatch(filteredProductsActions.setFilteredProducts(filtered));
            dispatch(filteredProductsActions.setFiltersActive(filtersActive));
        });
    }, [
        allProducts,
        filtered,
        filtersActive,
        dispatch,
        updatedCategories,
        updatedTypes,
        selectedColors,
        selectedPriceRange,
    ]);

    return (
        <aside className={cl.aside}>
            <FilterCategorys
                setUpdatedCategoriesState={setUpdatedCategoriesState}
                setUpdatedTypesState={setUpdatedTypesState}
            />
            <PriceWidget setSelectedPriceRange={setSelectedPriceRange} />
            <FilterColors setSelectedColors={setSelectedColors} />
        </aside>
    );
}

export default FiltersStickyBar;


