import React from 'react';
import cl from '../utils/styles/modules/AsideList.module.scss';
import { AsideSectionType, AsideLinksType } from '@/utils/types/renderComponents.type';

type Props = {
    section: AsideSectionType;
};

const AsideList: React.FC<Props> = ({ section = { title: '', links: [] } }) => {
    return (
        <div className={cl.catalog}>
            <ul className={cl.catalog__category}>
                {section.links.map((item) => (
                    <li className={cl.category__item} key={item.href}>
                        <span className={cl.category__item_content}>
                            {item.icon && typeof item.icon === 'string'
                                ? <img className={cl.category__item_img} src={item.icon} alt={`${item.text} icon`} />
                                : item.icon && React.isValidElement(item.icon) ? item.icon
                                : null
                                }
                            {item.text}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AsideList;
