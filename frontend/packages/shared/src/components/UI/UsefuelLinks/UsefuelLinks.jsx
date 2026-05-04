import React from 'react';
import { Link } from 'react-router-dom';

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
                            {'to' in link && link.to ? (
                                <Link to={link.to}>{link.text}</Link>
                            ) : (
                                <a href={'href' in link ? link.href : '#'}>{link.text}</a>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UsefuelLinks;



