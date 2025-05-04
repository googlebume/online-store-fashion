import React, { useEffect, useState } from "react";
import cl from "./HeaderToolsList.module.scss";
import shoppingCardImage from "@packages/shared/src/assets/images/icons/shoppingCardImage.png";
import filterIcon from "@packages/shared/src/assets/images/icons/filterIcon.png";
// import FiltersStickyBar from "../../PopupFilterBar";
import PopupFilterBar from "@packages/shared/src/components/PopupFilterBar";
import PopupBasket from '../../../../../../services/shop/src/components/PopupBasket'

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
                <img className={cl.tool__img} src={shoppingCardImage} alt="Кошик" />
                <p>Кошик</p>
            </div>
            <div 
                className={cl.tools__btn}
                onClick={e => {setFilterOpenStatus(!filterOpenStatus)}}
            >
                <img className={cl.tool__img} src={filterIcon} alt="Фільтр" />
                <p>Фільтер</p>
            </div>
        </div>

        {filterOpenStatus && <PopupFilterBar isOpen={filterOpenStatus} setIsOpen={setFilterOpenStatus}/>}
        {basketOpenStatus && <PopupBasket setBasketOpenStatus={setBasketOpenStatus} basketOpenStatus={basketOpenStatus}/>}
        </>
    );
};

export default HeaderToolsList;
