import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTextInputFilter } from "./useTextInputFilter";
import { filteredProductsActions } from "../../store";
import { ProductType } from "../types/prosuctData.type";

type SearchValueType = string | number | symbol;

export type FilterHook<T extends ProductType> = {
    filtered: T[];
    searchValue: SearchValueType;
    setSearchValue: (value: SearchValueType) => void;
    onFilterClick: () => void;
    returnFiltered?: T[];
};

export type SearchInputType<T extends ProductType> = {
    allData: T[] | (() => T[]);
    field: keyof T;
    setReturnFiltered?: React.Dispatch<React.SetStateAction<T[]>>;
};

export function useProductFilter<T extends ProductType>(
    allData: T[] | (() => T[]),
    field: keyof T,
): FilterHook<T> {
    const dispatch = useDispatch();
    const [allProducts, setAllProducts] = useState<T[]>([]);
    const [searchValue, setSearchValue] = useState<SearchValueType>('');
    const [returnFiltered, setReturnFiltered] = useState<T[]>([]);

    useEffect(() => {
        const prod = typeof allData === 'function' ? allData() : allData;
        setAllProducts(prod || []);
    }, [allData]);

    const { filtered } = useTextInputFilter<T>({
        data: allProducts,
        field,
        searchValue: String(searchValue).toLowerCase().trim(),
    });

    const onFilterClick = () => {
        dispatch(filteredProductsActions.setFilteredProducts(filtered));
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


