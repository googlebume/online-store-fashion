import React, { useState } from "react";
import cl from "./HeaderToolsList.module.scss";
import shoppingCardImage from "@packages/shared/src/assets/images/icons/shoppingCardImage.png";
import filterIcon from "@packages/shared/src/assets/images/icons/filterIcon.png";
import FiltersStickyBar from "../../PopupFilterBar";
import PopupFilterBar from "../../PopupFilterBar";

const HeaderToolsList = ({ setIsOpen }) => {

    const [filterOpenStatus, setFilterOpenStatus] = useState(false);
    return (

        <>
        <div className={cl.header__tools}>
            <div className={cl.tools__btn}>
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


        </>
    );
};

export default HeaderToolsList;
