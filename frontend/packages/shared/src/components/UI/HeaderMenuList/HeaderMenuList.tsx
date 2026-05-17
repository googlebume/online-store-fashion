import React, { useState } from 'react';
import { api } from '../../../routes/api'
import { Link } from 'react-router-dom';

import { headerMenuItems } from "../../../utils/constants/headerMenuItems";
import cl from './HeaderMenuList.module.scss'
import UserAuthBlock from '../UserAuthBlock/UserAuthBlock';


const HeaderMenuList = () => {

    

    return (
        <nav className={cl.header__menu}>
            <ul className={cl.menu__list}>

                {
                    headerMenuItems.map((item, index) => (

                        <li key={index} className={cl.menu__item}>

                            {
                                item.icon && typeof item.icon === 'string'
                                ? <img className={cl.menu__icon} src={item.icon} alt={`${item.title} icon`} />
                                : item.icon && React.isValidElement(item.icon) ? item.icon
                                : null
                            }

                            {item.isAnchor ? (
                                <a
                                    className={cl.menu__link}
                                    href={item.link}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const el = document.querySelector(item.link);
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    {item.title}
                                </a>
                            ) : (
                                <Link className={cl.menu__link} to={item.link}>
                                    {item.title}
                                </Link>
                            )}
                        </li>
                    ))
                }
            </ul>

            <UserAuthBlock loginUrl='register' />
        </nav >
    );
};

export default HeaderMenuList;


