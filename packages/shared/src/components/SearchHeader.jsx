import React from 'react';
import cl from '@packages/shared/src/utils/styles/HeaderSearchPie.module.scss'
import CategoriesButton from './UI/CategoriesButton/CategoriesButton';
import SearchInput from './UI/SearchInput/SearchInput';
import HeaderToolsList from './UI/HeaderToolsList/HeaderToolsList';

const SearchHeader = () => {
    return (
        <div className={cl.header_second}>
            <nav className={cl.header__main}>
                <CategoriesButton />
                <SearchInput />
                <HeaderToolsList />
            </nav>
        </div>
    );
};

export default SearchHeader;