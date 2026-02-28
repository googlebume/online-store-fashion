import { exportFilteredProducts, getAllProducts } from "@shop/state/productsData";
import React, { useEffect, useState } from "react";
import { useTextInputFilter } from "./useTextInputFilter";

type SearchValueType = string | number | symbol;

export type FilterHook<T> = {
    filtered: T[];
    searchValue: SearchValueType;
    setSearchValue: (value: SearchValueType) => void;
    onFilterClick: () => void;
    returnFiltered?: T[];
};

export type SearchInputType<T> = {
    allData: T[] | (() => T[]);
    field: keyof T;
    setReturnFiltered?: React.Dispatch<React.SetStateAction<T[]>>;
};

export function useProductFilter<T>(
    allData: T[] | (() => T[]),
    field: keyof T,
): FilterHook<T> {
    const [allProducts, setAllProducts] = useState<T[]>([]);
    const [searchValue, setSearchValue] = useState<SearchValueType>('');
    const [returnFiltered, setReturnFiltered] = useState<T[]>([]);

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
        setReturnFiltered(filtered);
    };

    return {
        filtered,
        searchValue,
        setSearchValue,
        onFilterClick,
        returnFiltered
    };
}


