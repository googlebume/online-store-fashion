import React from 'react';
import { api } from '../../../routes/api'
import { Routes, Route, Outlet, Link } from 'react-router-dom';

import { headerMenuItems } from "../../../utils/constants/headerMenuItems";
import cl from './HeaderMenuList.module.scss'

import userIcon from '@packages/shared/src/assets/images/icons/userIcon.png'

const HeaderMenuList = () => {


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

            <Link to={`/${api}/auth`}>
                <div className={cl.profile}>
                    <div className={cl.profile__icon}>
                        <img src={userIcon} alt="userIcon" />
                    </div>
                    <div className={cl.profile__name}>
                        <p className={cl.profile__naming}></p>
                    </div>
                </div>
            </Link>
        </nav >
    );
};

export default HeaderMenuList;