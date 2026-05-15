import React from 'react';
import cl from './App.module.scss'
import { Outlet, useLocation } from "react-router-dom";
import { administrationListItems } from '@/utils/constants/administrationList';

import AsideList from '@packages/shared/src/components/AsideList';
import AnalyticsRouteTracker from '@packages/shared/src/components/AnalyticsRouteTracker';
import FiltersStickyBar from '@packages/shared/src/components/FiltersStickyBar';

export const App = () => {
    const location = useLocation();
    const isProductsPage = location.pathname === '/fashion/admin/products';

    return (
        <div className={cl.wrapper}>
            <AnalyticsRouteTracker />
            <div className={cl.aside}>
                <AsideList section={ administrationListItems } enableMobileAsideDrawer />
                {isProductsPage && <FiltersStickyBar />}
            </div>
            <div className={cl.content}>
                    <Outlet />
            </div>
        </div>
    );
};



