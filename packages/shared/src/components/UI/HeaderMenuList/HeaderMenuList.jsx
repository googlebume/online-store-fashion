import React from 'react';
import { menuItems } from "@/utils/constants/headerMenuItems";

const HeaderMenuList = () => {


    return (
        <nav className='header__menu'>
            <ul className='menu__list'>
                {
                    menuItems.map((item) =>{
                        <a href={item.link}>{item.title}</a>
                    })
                }
            </ul>
        </nav>
    );
};

export default HeaderMenuList;