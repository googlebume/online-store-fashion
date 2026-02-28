import React, { useState } from "react";
import cl from "@packages/shared/src/utils/styles/modules/HeaderSearchPie.module.scss";
import Button from "./UI/Button/Button";
import SquaresIcon from '@packages/shared/src/assets/images/icons/squaresIcon.svg'
import SearchInput from "./UI/form-controls/SearchInput/SearchInput";
import HeaderToolsList from "./UI/HeaderToolsList/HeaderToolsList";
import { getAllProducts } from "@shop/state/productsData";

const SearchHeader = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchData, setSearchData] = useState([])

    setTimeout(() => {
        setSearchData(getAllProducts());
        console.log('searchData', searchData)
    }, 50)

    return (
        <>
            <div className={cl.header_second}>
                <nav className={cl.header__main}>
                    <Button
                        variant='categories'
                        img={<SquaresIcon height='28px' width='28px' color='currentColor' fill='currentColor'/>}
                        text={<p>По категоріям</p>}
                    />
                    <div className={cl.search}>
                        <SearchInput allData={searchData} field={'name'}/>
                    </div>

                    <HeaderToolsList setIsOpen={setIsOpen} />
                </nav>
            </div>

            {/* {window.innerWidth >= 1069 && <PopupFiltersBar isOpen={isOpen} setIsOpen={setIsOpen} />} */}
        </>
    );
};

export default SearchHeader;



