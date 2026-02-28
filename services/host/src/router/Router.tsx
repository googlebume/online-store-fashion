import { createBrowserRouter, Navigate } from "react-router-dom";
import { App } from "@/components/App/App";
import { api } from '@packages/shared/src/routes/api'

// @ts-ignore
import productRoutes from 'product/Router';
// @ts-ignore
import shopRoutes from 'shop/Router';
// @ts-ignore
import adminRoutes from 'admin/Router';
// @ts-ignore
import authRoutes from 'auth/Router'
import ErrorNotFound from "@packages/shared/src/pages/ErrorNotFound/ErrorNotFound";
import Cookies from "@packages/shared/src/utils/cookies";
import JwtHandler from "@packages/shared/src/utils/jwt"


const jwtHandler = new JwtHandler()
const isAdmin = jwtHandler.getIsAdmin()


export const router = createBrowserRouter([
    {
        path: `/`,
        element: <App />,
        children: [
            {
                index: true,
                element: <Navigate to="/fashion/shop" replace />
            },
            {
                path: `*`,
                element: <ErrorNotFound />
            },
            ...productRoutes,
            ...shopRoutes,
            ...(isAdmin ? adminRoutes : []),
            ...authRoutes,
        ]
    },
]);


