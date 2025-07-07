import React, { useEffect, useState } from 'react';
import cl from './SearchInput.module.scss'
import ButtonImage from '../ButtonImage/ButtonImage';
import magnifyingGlass from '@packages/shared/src/assets/images/icons/magnifyingGlassIcon.svg?url'

import { exportFilteredProducts, getAllProducts } from '@shop/state/productsData';
import { useTextInputFilter } from '../../../utils/hooks/useTextInputFilter';
import { ProductType } from '@/utils/types/prosuctData.type';

const SearchInput = () => {
    const [allProducts, setAllProducts] = useState<ProductType[]>([]);
    const [value, setValue] = useState('');

    // useEffect(() => {
    //     const prod: ProductType[] = getAllProducts()
    //     setAllProducts(prod)
    //     console.log('proddd:   ', prod)
    // }, [])

    setTimeout(() => {
        const prod: ProductType[] = getAllProducts()
        setAllProducts(prod)
        console.log('proddd:   ', prod)
    }, 1);

    const searchValue = value.toLowerCase().trim();
    
    const { filtered, error, count } = useTextInputFilter<ProductType>({
        data: allProducts,
        field: 'name',
        searchValue: searchValue
    });

    const onhandleFilterClick = () => {


        exportFilteredProducts(filtered)

    };


    return (
        <div className={cl.header__search}>
            <input
                type='text'
                max={20}
                value={value}
                className={cl.search__input}
                onChange={e => setValue(e.target.value)}
            >
            </input>
            <div className={cl.button}>
                <ButtonImage
                    img={magnifyingGlass}
                    width={24}
                    onClick={onhandleFilterClick}
                />
            </div>

        </div>
    );
};

export default SearchInput;