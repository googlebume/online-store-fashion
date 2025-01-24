import React, { useEffect, useRef } from 'react'; 
import { bannerStageItems } from '@/utils/constants/bannerStageItems.js';
import cl from '@/utils/styles/BannersCarousel.module.scss';

const BannersCarousel = () => {
    const refContainer = useRef();
    const refFirstBanner = useRef();

    useEffect(() => {
        let intervalId;
        if (refFirstBanner.current && refContainer.current) {
            const bannerWidth = refFirstBanner.current.offsetWidth;
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
            }, 5000);
        }

        // Очищення інтервалу при демонтажі
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, []);

    return (
        <div 
            className={cl.stage} 
            ref={refContainer} 
            style={{ overflow: 'hidden', display: 'flex' }}
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
    );
};

export default BannersCarousel;
