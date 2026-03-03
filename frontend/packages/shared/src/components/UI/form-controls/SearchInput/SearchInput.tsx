import React, { useEffect } from 'react';
import cl from './SearchInput.module.scss';
import Button from '@packages/shared/src/components/UI/Button/Button';
import magnifyingGlass from '@packages/shared/src/assets/images/icons/magnifyingGlassIcon.svg?url';

import { useProductFilter, type SearchInputType } from '../../../../utils/hooks/useFilter';
import { ProductType } from '@packages/shared/src/utils/types/prosuctData.type';

const SearchInput = <T extends ProductType>({
    allData,
    field,
    setReturnFiltered
}: SearchInputType<T>) => {
    const {
        filtered,
        searchValue,
        setSearchValue,
        onFilterClick,
    } = useProductFilter<T>(allData, field);

    useEffect(() => {
        if (setReturnFiltered) {
            setReturnFiltered(filtered);
        }
    }, [filtered, setReturnFiltered]);

    return (
        <div className={cl.header__search}>
            <input
                type='text'
                maxLength={20}
                value={String(searchValue)}
                className={cl.search__input}
                onChange={e => setSearchValue(e.target.value)}
            />
            <div className={cl.button}>
                <Button
                    variant='icon'
                    img={magnifyingGlass}
                    width={24}
                    onClick={onFilterClick}
                />
            </div>
        </div>
    );
};

export default SearchInput;


