import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import cl from '../utils/styles/modules/AsideList.module.scss';
import { AsideSectionType } from '@/utils/types/renderComponents.type';
import { Link, useLocation } from 'react-router-dom';

type Props = {
    section: AsideSectionType;
};

const AsideList: React.FC<Props> = ({ section = { title: '', links: [] } }) => {
    const location = useLocation();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const railRef = useRef<HTMLButtonElement>(null);

    const syncDrawerTop = () => {
        if (!railRef.current || typeof window === 'undefined') return;
        if (window.matchMedia('(min-width: 1175px)').matches) {
            document.documentElement.style.removeProperty('--aside-drawer-top');
            return;
        }
        const bottom = railRef.current.getBoundingClientRect().bottom;
        document.documentElement.style.setProperty('--aside-drawer-top', `${bottom}px`);
    };

    useLayoutEffect(() => {
        syncDrawerTop();
        window.addEventListener('resize', syncDrawerTop);
        return () => {
            window.removeEventListener('resize', syncDrawerTop);
            document.documentElement.style.removeProperty('--aside-drawer-top');
        };
    }, [drawerOpen]);

    useEffect(() => {
        setDrawerOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (!drawerOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setDrawerOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [drawerOpen]);

    useEffect(() => {
        if (!drawerOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [drawerOpen]);

    return (
        <div className={cl.root}>
            <button
                ref={railRef}
                type="button"
                className={`${cl.mobileRail} ${drawerOpen ? cl.mobileRail_open : ''}`}
                aria-expanded={drawerOpen}
                aria-label={drawerOpen ? 'Закрити меню розділів' : 'Відкрити меню розділів'}
                onClick={() => setDrawerOpen((o) => !o)}
            >
                <span className={cl.mobileRail_burgerIcon} aria-hidden>
                    <span className={cl.mobileRail_line} />
                    <span className={cl.mobileRail_line} />
                    <span className={cl.mobileRail_line} />
                </span>
                <span className={cl.mobileRail_title}>Розділи</span>
            </button>
            <div
                className={cl.backdrop}
                aria-hidden={!drawerOpen}
                data-open={drawerOpen}
                onClick={() => setDrawerOpen(false)}
            />
            <aside className={`${cl.catalog} ${drawerOpen ? cl.catalog_drawerOpen : ''}`}>
                <ul className={cl.catalog__category}>
                    {section.links.map((item, index) => (
                        <li className={cl.category__item} key={`${item.href}-${index}`}>
                            <Link to={item.href}>
                                <span className={cl.category__item_content}>
                                    {item.icon && typeof item.icon === 'string' ? (
                                        <img
                                            className={cl.category__item_img}
                                            src={item.icon}
                                            alt=""
                                        />
                                    ) : item.icon && React.isValidElement(item.icon) ? (
                                        item.icon
                                    ) : null}
                                    {item.text}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </aside>
        </div>
    );
};

export default AsideList;
