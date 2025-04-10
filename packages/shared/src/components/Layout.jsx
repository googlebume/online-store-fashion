import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import MainHeader from '@packages/shared/src/components/MainHeader';
import MainFooter from './MainFooter';
// import SearchHeader from './SearchHeader';

const Layout = ( ) => {
    
    return (
        <>
        <MainHeader />
        {/* <SearchHeader /> */}
        <main>
            <Outlet />
        </main>
        <MainFooter />
        </>
    );
};

export default Layout;