import React from 'react';

import cl from './UsefuelLinks.module.scss'

const UsefuelLinks = ({ title, links }) => {
    return (
        <div className={cl.info__block}>
            <div className={cl.block__title}>
                <h3>{title}</h3>
            </div>
            <div className={cl.block__list}>
                <ul>
                    {links.map((link, index) => (
                        <li key={index} className={cl.list__li}>
                            <a href={link.href}>{link.text}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UsefuelLinks;



