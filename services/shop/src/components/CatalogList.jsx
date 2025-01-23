import React from 'react';
import { catalogListItems } from '../utils/constants/catalogListItems.js';
import cl from '../utils/styles/CatalogList.module.scss';

const CatalogList = () => {
    return (
        <div className={cl.catalog}>
            <ul className={cl.catalog__category}>
                {
                    catalogListItems[0].links.map((item) => ( // Додаємо [0], оскільки catalogListItems — масив об'єктів
                        <li className={cl.category__item} key={item.href}>
                            <span className={cl.category__item_content}>
                                <img
                                    className={cl.category__item_img}
                                    src={item.icon}
                                    alt={item.text}
                                />
                                {item.text}
                            </span>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
};

export default CatalogList;
