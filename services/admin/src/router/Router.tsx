import { createBrowserRouter, Navigate } from "react-router-dom";
import { App } from "@/components/App/App";
import { Suspense } from "react";
import { api } from '@packages/shared/src/routes/api'
import { LazyAdminShopUsers } from "@/pages/AdminShopUsers/AdminShopUsers.lazy";

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
                path: `users`,
                element: <Suspense fallback={'Loading...'}><LazyAdminShopUsers /></Suspense>
            },
            {
                index: true,
                path: `products`,
                element: <Suspense fallback={'Loading...'}><LazyAdminShopUsers /></Suspense>
            },
        ]
    },
]

export const router = createBrowserRouter(routes);

export default routes;