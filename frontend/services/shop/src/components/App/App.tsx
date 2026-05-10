import React, { useEffect, useRef, useState } from 'react';

import ShopPlaceholder from '../ShopPlaceholder';
import FullScreenArrowButton from '../UI/FullScreenArrowButton/FullScreenArrowButton';
import ShopOverview from '../ShopOverview';
import SearchHeader from '@packages/shared/src/components/SearchHeader';

export const App = () => {
    const [shopAsideOpen, setShopAsideOpen] = useState(false);
    const shopHeaderAnchorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mq = window.matchMedia('(min-width: 1175px)');
        const closeOnDesktop = () => {
            if (mq.matches) setShopAsideOpen(false);
        };
        mq.addEventListener('change', closeOnDesktop);
        return () => mq.removeEventListener('change', closeOnDesktop);
    }, []);

    const handleCategoriesClick = () => {
        if (window.matchMedia('(max-width: 1174px)').matches) {
            setShopAsideOpen((open) => !open);
        }
    };

    return (
        <div className="wrapper">
            <div ref={shopHeaderAnchorRef}>
                <SearchHeader onCategoriesClick={handleCategoriesClick} />
            </div>
            <ShopPlaceholder
                shopAsideOpen={shopAsideOpen}
                onShopAsideOpenChange={setShopAsideOpen}
                shopAsideTopAnchorRef={shopHeaderAnchorRef}
            />
            <FullScreenArrowButton />
            <ShopOverview />
        </div>
    );
};


