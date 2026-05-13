import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { headerMenuItems } from '../../../utils/constants/headerMenuItems';
import cl from './BurgerMenu.module.scss';
import Button from '../Button/Button';

import UserAuthBlock from '../UserAuthBlock/UserAuthBlock';

const BurgerMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isMenuOpen]);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

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
                            {item.icon && typeof item.icon === 'string'
                                ? <img className={cl.menu__icon} src={item.icon} alt={`${item.title} icon`} />
                                : item.icon && React.isValidElement(item.icon)
                                ? <span className={cl.menu__icon}>{item.icon}</span>
                                : null
                            }
                            <Link className={cl.menu__link} to={item.link}>
                                {item.title}
                            </Link>
                        </li>
                    ))}
                </ul>

                <span className={cl.burgerMenu__hr}></span>

                <UserAuthBlock loginUrl='register' variant='burger' />
            </nav>
        </div>
    );
};

export default BurgerMenu;




