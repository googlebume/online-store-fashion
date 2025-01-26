import React, {useState} from 'react';
import {Link, Outlet} from "react-router-dom";

import SearchHeader from '../../../../../packages/shared/src/components/SearchHeader';
import ShopPlaceholder from '../ShopPlaceholder';
import FullScreenArrowButton from '../UI/FullScreenArrowButton/FullScreenArrowButton';


export const App = () => {

    return (
        <div className='wrapper'>
            <SearchHeader />
            <ShopPlaceholder />
            <FullScreenArrowButton />
        </div>
    );
};
