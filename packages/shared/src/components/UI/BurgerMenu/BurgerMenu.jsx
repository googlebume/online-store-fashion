import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { headerMenuItems } from '../../../utils/constants/headerMenuItems';
import cl from './BurgerMenu.module.scss';
import Button from '../Button/Button';

import userIcon from '@packages/shared/src/assets/images/icons/userIcon.png';
import UserProfileCard from '../UserProfileCard/UserProfileCard';

const BurgerMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';

        }

  
    }, [isMenuOpen]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className={cl.burgerMenu}>
            <Button
                variant='burger'
                open={isMenuOpen}
                onClick={toggleMenu}
            />

            <nav
                className={`${cl.header__menu} ${isMenuOpen ? cl.menu__open : ''}`}
            >
                <ul className={cl.menu__list}>
                    {headerMenuItems.map((item, index) => (
                        <li key={index} className={cl.menu__item}>
                            <img
                                className={cl.menu__icon}
                                src={item.icon}
                                alt={`${item.title} icon`}
                            />
                            <Link className={cl.menu__link} to={item.link}>
                                {item.title}
                            </Link>
                        </li>
                    ))}
                </ul>

                <span className={cl.burgerMenu__hr}></span>

                <UserProfileCard url='auth' style='burger'/>
            </nav>
        </div>
    );
};

export default BurgerMenu;




