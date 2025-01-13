import React from 'react';
import {Routes, Route, Outlet, Link} from 'react-router-dom';

import MainHeader from "@packages/shared/src/components/MainHeader"
import MainFooter from './MainFooter';

const Layout = () => {
    return (
        <>
            <MainHeader />
            <div>ehjdjdhdjhdjhdjhdjdh</div>

            <Outlet />

            <MainFooter />
        </>
    );
};

export default Layout;