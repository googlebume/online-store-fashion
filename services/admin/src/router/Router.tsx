import { createBrowserRouter, Navigate } from "react-router-dom";
import { App } from "@/components/App/App";
import { Suspense } from "react";
import { api } from '@packages/shared/src/routes/api'
import { LazyAdminUsers } from "@/pages/AdminUsers/AdminUsers.lazy";
import { LazyAdminAnalytics } from "@/pages/AdminAnalytics/AdminAnalytics.lazy";

import {adminRoutes} from '@packages/shared/src/routes/admin'
import { LazyAdminProducts } from "@/pages/AdminProducts/AdminProducts.lazy";

const routes = [
    {
        index: true,
        element: <Navigate to={`/${api}/admin`} replace />
    },
    {
        path: `${api}/admin`,
        element: <App />,
        children: [
            {
                index: true,
                path: `${adminRoutes.users}`,
                element: <Suspense fallback={'Loading...'}><LazyAdminUsers /></Suspense>
            },
            {
                index: true,
                path: `${adminRoutes.products}`,
                element: <Suspense fallback={'Loading...'}><LazyAdminProducts /></Suspense>
            },
            {
                index: true,
                path: `${adminRoutes.analytics}`,
                element: <Suspense fallback={'Loading...'}><LazyAdminAnalytics /></Suspense>
            },
        ]
    },
]

export const router = createBrowserRouter(routes);

export default routes;