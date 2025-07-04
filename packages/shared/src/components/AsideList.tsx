import React from 'react';
import cl from '../utils/styles/modules/CatalogList.module.scss';
import { AsideSectionType, AsideLinksType } from '@/utils/types/renderComponents.type';

type Props = {
    section: AsideSectionType;
};

const AsideList: React.FC<Props> = ({ section }) => {
    return (
        <div className={cl.catalog}>
            <ul className={cl.catalog__category}>
                {section.links.map((item: AsideLinksType) => (
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
                ))}
            </ul>
        </div>
    );
};

export default AsideList;
