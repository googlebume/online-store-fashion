import React from 'react';
import cl from './SearchInput.module.scss'

const SearchInput = () => {
    return (
        <div className={cl.header__search}>
            <input type='text' max={10} className={cl.search__input}></input>
        </div>
    );
};

export default SearchInput;