import React, { useState } from "react";
import cl from "@packages/shared/src/utils/styles/modules/HeaderSearchPie.module.scss";
import CategoriesButton from "./UI/CategoriesButton/CategoriesButton";
import SearchInput from "./UI/SearchInput/SearchInput";
import HeaderToolsList from "./UI/HeaderToolsList/HeaderToolsList";
// import PopupFiltersBar from "./PopupFiltersBar";


const SearchHeader = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className={cl.header_second}>
                <nav className={cl.header__main}>
                    <CategoriesButton />
                    <SearchInput />
                    <HeaderToolsList setIsOpen={setIsOpen} />
                </nav>
            </div>

            {/* {window.innerWidth >= 1069 && <PopupFiltersBar isOpen={isOpen} setIsOpen={setIsOpen} />} */}
        </>
    );


};

export default SearchHeader;
