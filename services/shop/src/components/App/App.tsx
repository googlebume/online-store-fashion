import React, {useState} from 'react';
import {Link, Outlet} from "react-router-dom";

import SearchHeader from '../../../../../packages/shared/src/components/SearchHeader';
import ShopPlaceholder from '../ShopPlaceholder';
import FullScreenArrowButton from '../UI/FullScreenArrowButton/FullScreenArrowButton';
import ShopOverview from '../ShopOverview';


export const App = () => {

    return (
        <div className='wrapper'>
            <SearchHeader />
            <ShopPlaceholder />
            <FullScreenArrowButton />
            <ShopOverview />
        </div>
    );
};
