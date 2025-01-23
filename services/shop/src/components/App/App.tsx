import React, {useState} from 'react';
import {Link, Outlet} from "react-router-dom";

import SearchHeader from '../../../../../packages/shared/src/components/SearchHeader';
import CatalogList from '../CatalogList';


export const App = () => {

    return (
        <>
            <SearchHeader />
            
            <CatalogList />
        </>
    );
};
