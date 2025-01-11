import React from 'react';
import { headerMenuItems } from "../../../utils/constants/headerMenuItems";
import cl from './HeaderMenuList.scss'

import userIcon from '@packages/shared/src/assets/images/icons/userIcon.png'

const HeaderMenuList = () => {


    return (
        <nav className={cl.header__menu}>
            <ul className={cl.menu__list}>

                {
                headerMenuItems.map((item, index) => (

                    <li key={index} className={cl.menu__item}>

                        <img className={cl.menu__icon} src={item.icon} alt={`${item.title} icon`} />
                        
                        <a className={cl.menu__link} href={item.link}>
                            {item.title}
                        </a>
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

export default HeaderMenuList;