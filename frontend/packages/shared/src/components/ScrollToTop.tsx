import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

function scrollWindowToTop(): void {
    const y = 0;
    const x = 0;

    window.scrollTo(x, y);
    window.scrollTo({ top: y, left: x, behavior: 'auto' });

    if (document.scrollingElement) {
        document.scrollingElement.scrollTop = y;
        document.scrollingElement.scrollLeft = x;
    }
    document.documentElement.scrollTop = y;
    document.documentElement.scrollLeft = x;
    document.body.scrollTop = y;
    document.body.scrollLeft = x;
}

/**
 * Скидає скрол вікна на початок при зміні маршруту.
 * useLayoutEffect + повтор після кадру / таймера — щоб перебити scroll restoration і пізніший layout (картинки, шрифти).
 */
const ScrollToTop = (): null => {
    const { pathname, search, hash } = useLocation();

    useLayoutEffect(() => {
        if (typeof window === 'undefined') {
            return undefined;
        }

        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        scrollWindowToTop();

        const raf = requestAnimationFrame(() => {
            scrollWindowToTop();
            requestAnimationFrame(() => {
                scrollWindowToTop();
            });
        });

        const t0 = window.setTimeout(() => scrollWindowToTop(), 0);
        const t1 = window.setTimeout(() => scrollWindowToTop(), 50);

        return () => {
            cancelAnimationFrame(raf);
            window.clearTimeout(t0);
            window.clearTimeout(t1);
        };
    }, [pathname, search, hash]);

    return null;
};

export default ScrollToTop;
