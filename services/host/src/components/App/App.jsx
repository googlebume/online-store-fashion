import React, { useState } from 'react';
import { Routes, Route, Link, Outlet } from "react-router-dom";
import { adminRoutes } from '@packages/shared/src/routes/admin'
import { shopRoutes } from '@packages/shared/src/routes/shop'
import Layout from '@packages/shared/src/components/Layout'

import ErrorNotFound from '@packages/shared/src/components/ErrorNotFound';
import MainShop from '@packages/shared/src/components/MainShop';

export const App = () => {

    return (
        <div>

            {/* <Routes>
                <Route path='/shop' element={<Layout />}>


                    <Route path='*' element={<ErrorNotFound />} />
                </Route>
            </Routes>
            <Outlet /> */}

            <Layout />
        </div>
    );
};
