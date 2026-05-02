import React, { useEffect, useState } from "react";
import cl from "./HeaderToolsList.module.scss";
import ShoppingCardIcon from "@packages/shared/src/assets/images/icons/shoppingCardIcon.svg";
import FilterIcon from "@packages/shared/src/assets/images/icons/filterIcon.svg";
// import FiltersStickyBar from "../../PopupFilterBar";
import PopupFilterBar from "@packages/shared/src/components/PopupFilterBar";
import PopupBasket from '../../../../../../services/shop/src/components/PopupBasket'
import { getCartItems, subscribeToCartChanges, syncCartFromStorage } from "@packages/shared/src/state/basketState";

import variables  from '@packages/shared/src/utils/styles/colorScheme'

const getTotalCartQuantity = () =>
    getCartItems().reduce((sum, item) => sum + (item.quantity ?? 1), 0);

const HeaderToolsList = ({ setIsOpen }) => {
    const [basketOpenStatus, setBasketOpenStatus] = useState(false);
    const [filterOpenStatus, setFilterOpenStatus] = useState(false);
    const [cartCount, setCartCount] = useState(() => getTotalCartQuantity());

    useEffect(() => {
        syncCartFromStorage();
        setCartCount(getTotalCartQuantity());
        const unsubscribe = subscribeToCartChanges(() => {
            setCartCount(getTotalCartQuantity());
        });
        return unsubscribe;
    }, []);
    useEffect(() => {
        basketOpenStatus ?
        document.body.style.overflow = 'hidden'
        : document.body.style.overflow = 'auto';
    }, [basketOpenStatus])
    return (

        <>
        <div className={cl.header__tools}>
            <div
                className={cl.tools__btn}
                onClick={e => {setBasketOpenStatus(!basketOpenStatus)}}
                aria-label={cartCount > 0 ? `Кошик, ${cartCount} товарів` : 'Кошик'}
            >
                <span className={cl.tools__btnIconWrap}>
                    <ShoppingCardIcon height='28px' width='28px' color={`${variables.yellow}`} fill={`${variables.yellow}`}/>
                    {cartCount > 0 && (
                        <span className={cl.cartBadge} aria-hidden="true">
                            {cartCount > 99 ? '99+' : cartCount}
                        </span>
                    )}
                </span>
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




