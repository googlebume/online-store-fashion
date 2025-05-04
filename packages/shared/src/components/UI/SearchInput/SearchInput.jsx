import React from 'react';
import cl from './SearchInput.module.scss'
import ButtonImage from '../ButtonImage/ButtonImage';
import magnifyingGlass from '@packages/shared/src/assets/images/icons/magnifyingGlass.png'

const SearchInput = () => {
    return (
        <div className={cl.header__search}>
            <input type='text' max={20} className={cl.search__input}></input>
            <div className={cl.button}>
                <ButtonImage
                    img={magnifyingGlass}
                    width={24}
                />
            </div>

        </div>
    );
};

export default SearchInput;