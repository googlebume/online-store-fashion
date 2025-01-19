import React from 'react';
import {Routes, Route, Outlet, Link} from 'react-router-dom';

import { headerMenuItems } from "../../../utils/constants/headerMenuItems";
import cl from './BurgerMenu.module.scss'

import userIcon from '@packages/shared/src/assets/images/icons/userIcon.png'

const BurgerMenu = () => {


    return (
        <nav className={cl.header__menu}>
            <ul className={cl.menu__list}>

                {
                headerMenuItems.map((item, index) => (

                    <li key={index} className={cl.menu__item}>

                        <img className={cl.menu__icon} src={item.icon} alt={`${item.title} icon`} />
                        
                        <Link className={cl.menu__link} to={item.link}>
                            {item.title}
                        </Link>
                    </li>
                ))
                }
            </ul>

            <div className={cl.profile}>
                <div className={cl.profile__icon}>
                    <img src={userIcon} alt="userIcon" />
                </div>
                <div className={cl.profile__name}>
                    <p className={cl.profile__naming}></p>
                </div>
            </div>
        </nav>
    );
};

export default BurgerMenu;