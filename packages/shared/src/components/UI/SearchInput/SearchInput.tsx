import React from 'react';
import cl from './SearchInput.module.scss';
import ButtonImage from '../ButtonImage/ButtonImage';
import magnifyingGlass from '@packages/shared/src/assets/images/icons/magnifyingGlass.png';

import { useProductFilter, type SearchInputType } from '../../../utils/hooks/useFilter';

const SearchInput = <T extends Record<string, any>>({
    allData,
    field
}: SearchInputType<T>) => {
    const {
        filtered,
        searchValue,
        setSearchValue,
        onFilterClick
    } = useProductFilter<T>(allData, field);

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
                <ButtonImage
                    img={magnifyingGlass}
                    width={24}
                    onClick={onFilterClick}
                />
            </div>
        </div>
    );
};

export default SearchInput;
