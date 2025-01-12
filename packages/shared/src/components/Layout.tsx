import React from 'react';
import {Routes, Route, Outlet, Link} from 'react-router-dom';

import MainHeader from "@packages/shared/src/components/MainHeader"

const Layout = () => {
    return (
        <>
            <MainHeader />
            <div>ehjdjdhdjhdjhdjhdjdh</div>

            <Outlet />

            <footer>2025</footer>
        </>
    );
};

export default Layout;