import React, { useEffect, useRef, useState } from 'react';
import { bannerStageItems } from '@/utils/constants/bannerStageItems.js';
import cl from '@/utils/styles/BannersCarousel.module.scss';
import TransitionArrow from './UI/TransitionArrow/TransitionArrow';

const BannersCarousel = () => {
    const refContainer = useRef();
    const refFirstBanner = useRef();

    const [scrollWidth, setScrollWidth] = useState(0);

    useEffect(() => {
        let intervalId;
        if (refFirstBanner.current && refContainer.current) {
            const bannerWidth = refFirstBanner.current.offsetWidth;
            setScrollWidth(bannerWidth);
            const totalWidth = bannerWidth * bannerStageItems.length;

            intervalId = setInterval(() => {
                if (refContainer.current) {
                    const currentScroll = refContainer.current.scrollLeft;
                    const nextScroll = currentScroll + bannerWidth;

                    if (nextScroll >= totalWidth) {
                        // Якщо доскролили до кінця, повертаємося на початок
                        refContainer.current.scrollTo({
                            left: 0,
                            behavior: 'smooth',
                        });
                    } else {
                        // Звичайний скрол
                        refContainer.current.scrollBy({
                            left: bannerWidth,
                            behavior: 'smooth',
                        });
                    }
                }
            }, 3000);
        }

        // Очищення інтервалу при демонтажі
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [refContainer.offsetWidth]);


    const [isArrowVisible, setIsArrowVisible] = useState(false);

    return (
        <div className={cl.stage}>
            <div
                className={cl.stage__body}
                ref={refContainer}
                onMouseEnter={() => setIsArrowVisible(true)}
            >
                {bannerStageItems.map((stageItem, index) => (
                    <div
                        className={cl.stage__item}
                        key={stageItem.id}
                        ref={index === 0 ? refFirstBanner : null}
                    >
                        <img
                            src={stageItem.bannerSrc}
                            alt={stageItem.title}
                            className={cl.stage__bannerImg}
                        />
                    </div>
                ))}
            </div>
            <TransitionArrow visible={isArrowVisible}
                onClick={() => refContainer.current.scrollBy({ left: -scrollWidth, behavior: 'smooth'})}
                rotate="180deg" left="12px" />
            <TransitionArrow visible={isArrowVisible} 
                onClick={() => refContainer.current.scrollBy({ left: scrollWidth, behavior: 'smooth'})}
                rotate="0deg" left="calc(100% - 44px)" />
        </div>
    );
};

export default BannersCarousel;