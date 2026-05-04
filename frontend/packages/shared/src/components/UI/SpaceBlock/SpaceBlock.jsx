import React, { useEffect, useRef, useState } from 'react';

import cl from './SpaceBlock.module.scss';

/** Обмежує зсув, щоб не «вирізало» надто багато з україни cover */
const clampShift = (px, max = 160) => Math.min(Math.max(px, -max), max);

const SpaceBlockSidebar = ({ imageUrl }) => {
    const shellRef = useRef(null);
    const [shiftY, setShiftY] = useState(0);
    const [reduceMotion, setReduceMotion] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReduceMotion(mq.matches);
        const onPrefs = () => setReduceMotion(mq.matches);
        mq.addEventListener('change', onPrefs);
        return () => mq.removeEventListener('change', onPrefs);
    }, []);

    useEffect(() => {
        if (reduceMotion) {
            return undefined;
        }

        let rafId = 0;

        const tick = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const el = shellRef.current;
                if (!el) return;

                const rect = el.getBoundingClientRect();
                const vh = window.innerHeight;

                /* Головний рух: фон реагує на положення блоку у вікні (як «справжній» паралакс) */
                const fromViewport = -rect.top * 0.22;

                /* Додатковий нахил відносно центру екрана */
                const viewMid = vh / 2;
                const elMid = rect.top + rect.height / 2;
                const fromCenter = ((elMid - viewMid) / vh) * -48;

                setShiftY(clampShift(fromViewport + fromCenter, 170));
            });
        };

        window.addEventListener('scroll', tick, { passive: true });
        window.addEventListener('resize', tick);
        tick();

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('scroll', tick);
            window.removeEventListener('resize', tick);
        };
    }, [reduceMotion]);

    const layerClass = reduceMotion ? cl.sidebarParallaxLayerReduced : cl.sidebarParallaxLayer;

    return (
        <div ref={shellRef} className={cl.sidebarShell} aria-hidden>
            <div
                className={layerClass}
                style={{
                    backgroundImage: `url(${imageUrl})`,
                    ...(reduceMotion ? {} : { transform: `translate3d(0, ${shiftY}px, 0)` }),
                }}
            />
        </div>
    );
};

/**
 * @param {object} props
 * @param {string} [props.height] — висота для варіанту у футері (напр. `12vh`)
 * @param {string} [props.fileName] — файл у `assets/images/backdrops/`
 * @param {string} [props.imageSrc] — готовий URL зображення (імпорт webpack); має пріоритет над fileName
 * @param {'default' | 'sidebar'} [props.variant] — `sidebar`: колонка на всю висоту контейнера
 */
const SpaceBlock = ({ height, fileName, imageSrc, variant = 'default' }) => {
    const resolved =
        imageSrc ??
        (fileName ? require(`@packages/shared/src/assets/images/backdrops/${fileName}`) : null);

    if (!resolved) {
        return null;
    }

    if (variant === 'sidebar') {
        return <SpaceBlockSidebar imageUrl={resolved} />;
    }

    return (
        <div
            className={cl.footer__space_block}
            style={{
                ...(height ? { height } : {}),
                backgroundImage: `url(${resolved})`,
            }}
        />
    );
};

export default SpaceBlock;
