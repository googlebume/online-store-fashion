import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import MainHeader from '@packages/shared/src/components/MainHeader';
import MainFooter from './MainFooter';

const Layout = ( ) => {
    
    return (
        <>
        <MainHeader />

        <main>
            <Outlet />
        </main>
        <MainFooter />
        </>
    );
};

export default Layout;