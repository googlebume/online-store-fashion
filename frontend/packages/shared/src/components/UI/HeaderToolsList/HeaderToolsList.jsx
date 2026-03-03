import React, { useEffect, useState } from "react";
import cl from "./HeaderToolsList.module.scss";
import ShoppingCardIcon from "@packages/shared/src/assets/images/icons/shoppingCardIcon.svg";
import FilterIcon from "@packages/shared/src/assets/images/icons/filterIcon.svg";
// import FiltersStickyBar from "../../PopupFilterBar";
import PopupFilterBar from "@packages/shared/src/components/PopupFilterBar";
import PopupBasket from '../../../../../../services/shop/src/components/PopupBasket'

import variables  from '@packages/shared/src/utils/styles/colorScheme'

const HeaderToolsList = ({ setIsOpen }) => {
    const [basketOpenStatus, setBasketOpenStatus] = useState(false);
    const [filterOpenStatus, setFilterOpenStatus] = useState(false);
    useEffect(() => {
        basketOpenStatus ?
        document.body.style.overflow = 'hidden'
        : document.body.style.overflow = 'auto';
    }, [basketOpenStatus])
    return (

        <>
        <div className={cl.header__tools}>
            <div className={cl.tools__btn} onClick={e => {setBasketOpenStatus(!basketOpenStatus)}}>
                <ShoppingCardIcon height='28px' width='28px' color={`${variables.yellow}`} fill={`${variables.yellow}`}/>
                <p>Кошик</p>
            </div>
            <div 
                className={cl.tools__btn}
                onClick={e => {setFilterOpenStatus(!filterOpenStatus)}}
            >
                <FilterIcon height='28px' width='28px' color={`${variables.yellow}`} fill={`${variables.yellow}`}/>
                <p>Фільтр</p>
            </div>
        </div>

        {filterOpenStatus && <PopupFilterBar isOpen={filterOpenStatus} setIsOpen={setFilterOpenStatus}/>}
        {basketOpenStatus && <PopupBasket setBasketOpenStatus={setBasketOpenStatus} basketOpenStatus={basketOpenStatus}/>}
        </>
    );
};

export default HeaderToolsList;




