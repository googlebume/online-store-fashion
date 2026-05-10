import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import cl from '../utils/styles/modules/AsideList.module.scss';
import { AsideSectionType } from '@/utils/types/renderComponents.type';
import { Link, useLocation } from 'react-router-dom';

type Props = {
    section: AsideSectionType;
    /** Кнопка «Розділи» та внутрішній стан drawer (адмін-панель). */
    enableMobileAsideDrawer?: boolean;
    /** Керований drawer без кнопки в AsideList (магазин — відкриття з хедера). */
    mobileDrawerOpen?: boolean;
    onMobileDrawerOpenChange?: (open: boolean) => void;
    mobileDrawerTopAnchorRef?: React.RefObject<HTMLElement | null>;
};

const AsideList: React.FC<Props> = ({
    section = { title: '', links: [] },
    enableMobileAsideDrawer = false,
    mobileDrawerOpen,
    onMobileDrawerOpenChange,
    mobileDrawerTopAnchorRef,
}) => {
    const location = useLocation();
    const [railDrawerOpen, setRailDrawerOpen] = useState(false);
    const railRef = useRef<HTMLButtonElement>(null);

    const useParentControlledDrawer = Boolean(onMobileDrawerOpenChange);
    const useMobileDrawerChrome =
        enableMobileAsideDrawer || useParentControlledDrawer;
    /** Без rail і без зовнішнього drawer — каталог у потоці на вузькому екрані. */
    const useInlineMobileCatalog = !useMobileDrawerChrome;

    const drawerOpen = enableMobileAsideDrawer
        ? railDrawerOpen
        : useParentControlledDrawer
          ? (mobileDrawerOpen ?? false)
          : false;

    const setDrawerOpen = (value: boolean | ((prev: boolean) => boolean)) => {
        if (enableMobileAsideDrawer) {
            setRailDrawerOpen((prev) =>
                typeof value === 'function' ? value(prev) : value,
            );
        } else if (onMobileDrawerOpenChange) {
            const prev = mobileDrawerOpen ?? false;
            const next = typeof value === 'function' ? value(prev) : value;
            onMobileDrawerOpenChange(next);
        }
    };

    const syncDrawerTop = () => {
        const anchorEl = enableMobileAsideDrawer
            ? railRef.current
            : mobileDrawerTopAnchorRef?.current ?? null;
        if (!anchorEl || typeof window === 'undefined') return;
        if (window.matchMedia('(min-width: 1175px)').matches) {
            document.documentElement.style.removeProperty('--aside-drawer-top');
            return;
        }
        const bottom = anchorEl.getBoundingClientRect().bottom;
        document.documentElement.style.setProperty('--aside-drawer-top', `${bottom}px`);
    };

    useLayoutEffect(() => {
        if (!useMobileDrawerChrome) return;
        syncDrawerTop();
        window.addEventListener('resize', syncDrawerTop);
        return () => {
            window.removeEventListener('resize', syncDrawerTop);
            document.documentElement.style.removeProperty('--aside-drawer-top');
        };
    }, [drawerOpen, useMobileDrawerChrome, enableMobileAsideDrawer]);

    useEffect(() => {
        if (enableMobileAsideDrawer) {
            setRailDrawerOpen(false);
        } else if (onMobileDrawerOpenChange) {
            onMobileDrawerOpenChange(false);
        }
    }, [location.pathname, enableMobileAsideDrawer, onMobileDrawerOpenChange]);

    useEffect(() => {
        if (!drawerOpen || !useMobileDrawerChrome) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setDrawerOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [drawerOpen, useMobileDrawerChrome]);

    useEffect(() => {
        if (!drawerOpen || !useMobileDrawerChrome) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [drawerOpen, useMobileDrawerChrome]);

    return (
        <div
            className={`${cl.root} ${useInlineMobileCatalog ? cl.root_mobileInline : ''}`}
        >
            {enableMobileAsideDrawer ? (
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
            ) : null}
            {useMobileDrawerChrome ? (
                <div
                    className={cl.backdrop}
                    aria-hidden={!drawerOpen}
                    data-open={drawerOpen}
                    onClick={() => setDrawerOpen(false)}
                />
            ) : null}
            <aside
                className={`${cl.catalog} ${
                    useMobileDrawerChrome && drawerOpen ? cl.catalog_drawerOpen : ''
                }`}
            >
                <ul className={cl.catalog__category}>
                    {section.links.map((item, index) => (
                        <Link to={item.href} key={`${item.href}-${index}`}>
                            <li className={cl.category__item} key={`${item.href}-${index}`}>
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
                            </li>
                        </Link>
                    ))}
                </ul>
            </aside>
        </div>
    );
};

export default AsideList;
