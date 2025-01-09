import React from 'react';
import { headerMenuItems } from "../../../utils/constants/headerMenuItems";


const HeaderMenuList = () => {


    return (
        <nav className='header__menu'>
            <ul className='menu__list'>
                {
                    headerMenuItems.map((item) =>{
                        return (
                            <a href={item.link}>{item.title}</a>
                        )
                    })
                }
            </ul>
        </nav>
    );
};

export default HeaderMenuList;