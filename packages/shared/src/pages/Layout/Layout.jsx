import React from 'react';
import { Outlet } from 'react-router-dom';

import MainHeader from '@packages/shared/src/components/MainHeader';
import MainFooter from '@packages/shared/src/components/MainFooter';

const Layout = () => {
    return (
        <>
            <MainHeader />
            <main>
                <div className="wrapper">
                    <Outlet />
                </div>
            </main>
            <MainFooter />
        </>
    );
};

export default Layout;


