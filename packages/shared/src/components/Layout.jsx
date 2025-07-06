import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import MainHeader from '@packages/shared/src/components/MainHeader';
import MainFooter from './MainFooter';
import SearchHeader from './SearchHeader';
// import cl from '../utils/styles/global.module.scss'

const Layout = () => {

    return (
        <>
            <MainHeader />
            {/* <SearchHeader/> */}

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