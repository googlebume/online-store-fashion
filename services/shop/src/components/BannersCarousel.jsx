import React, { useEffect, useRef, useState } from 'react';
import { bannerStageItems } from '@/utils/constants/bannerStageItems.js';
import cl from '@/utils/styles/modules/BannersCarousel.module.scss';
import TransitionArrow from './UI/TransitionArrow/TransitionArrow';

const BannersCarousel = () => {
    const refContainer = useRef();
    const refFirstBanner = useRef();

    const [scrollWidth, setScrollWidth] = useState(0);
    const [isArrowVisible, setIsArrowVisible] = useState(false);

    useEffect(() => {
        let intervalId;
        
        const timer = setTimeout(() => {
            if (refFirstBanner.current && refContainer.current) {
                const bannerWidth = refFirstBanner.current.offsetWidth;
                setScrollWidth(bannerWidth);
                const totalWidth = bannerWidth * bannerStageItems.length;

                intervalId = setInterval(() => {
                    if (refContainer.current) {
                        const currentScroll = refContainer.current.scrollLeft;
                        const nextScroll = currentScroll + bannerWidth;

                        if (nextScroll >= totalWidth) {
                            refContainer.current.scrollTo({
                                left: 0,
                                behavior: 'smooth',
                            });
                        } else {
                            refContainer.current.scrollBy({
                                left: bannerWidth,
                                behavior: 'smooth',
                            });
                        }
                    }
                }, 4000);
            }
        }, 100);

        return () => {
            clearTimeout(timer);
            if (intervalId) clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (refFirstBanner.current) {
                setScrollWidth(refFirstBanner.current.offsetWidth);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div 
            className={cl.stage}
            onMouseEnter={() => setIsArrowVisible(true)}
            onMouseLeave={() => setIsArrowVisible(false)}
        >
            <div
                className={cl.stage__body}
                ref={refContainer}
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
                            onLoad={() => {
                                if (index === 0 && refFirstBanner.current) {
                                    setScrollWidth(refFirstBanner.current.offsetWidth);
                                }
                            }}
                        />
                    </div>
                ))}
            </div>
            <TransitionArrow 
                visible={isArrowVisible}
                onClick={() => {
                    if (refContainer.current && scrollWidth > 0) {
                        refContainer.current.scrollBy({ 
                            left: -scrollWidth, 
                            behavior: 'smooth'
                        });
                    }
                }}
                rotate="180deg" 
                left="12px" 
            />
            <TransitionArrow 
                visible={isArrowVisible} 
                onClick={() => {
                    if (refContainer.current && scrollWidth > 0) {
                        refContainer.current.scrollBy({ 
                            left: scrollWidth, 
                            behavior: 'smooth'
                        });
                    }
                }}
                rotate="0deg" 
                left="calc(100% - 44px)" 
            />
        </div>
    );
};

export default BannersCarousel;