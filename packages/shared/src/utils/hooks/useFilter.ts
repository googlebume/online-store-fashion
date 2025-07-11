import { exportFilteredProducts, getAllProducts } from "@shop/state/productsData";
import { useEffect, useState } from "react";
import { useTextInputFilter } from "./useTextInputFilter";

type SearchValueType = string | number | symbol;

export type FilterHook<T> = {
    filtered: T[];
    searchValue: SearchValueType;
    setSearchValue: (value: SearchValueType) => void;
    onFilterClick: () => void;
};

export type SearchInputType<T> = {
    allData: T[] | (() => T[]);
    field: keyof T;
};

export function useProductFilter<T>(
    allData: T[] | (() => T[]),
    field: keyof T,
): FilterHook<T> {
    const [allProducts, setAllProducts] = useState<T[]>([]);
    const [searchValue, setSearchValue] = useState<SearchValueType>('');

    useEffect(() => {
        const prod = typeof allData === 'function' ? allData() : allData;
        setAllProducts(prod || getAllProducts());
    }, [allData]);

    const { filtered } = useTextInputFilter<T>({
        data: allProducts,
        field,
        searchValue: String(searchValue).toLowerCase().trim(),
    });

    const onFilterClick = () => {
        exportFilteredProducts(filtered);
    };

    return {
        filtered,
        searchValue,
        setSearchValue,
        onFilterClick,
    };
}
