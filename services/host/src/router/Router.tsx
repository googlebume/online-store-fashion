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
import ErrorNotFound from "@packages/shared/src/components/ErrorNotFound";
import Cookies from "@packages/shared/src/utils/cookies";

const cookies = new Cookies();
let isAdmin;

const token = cookies.getCookie('token');

try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    const parsedPayoad = JSON.parse(payload);
    isAdmin = parsedPayoad.roles.some((role: string) => role === 'admin')
} catch (error) {
    throw new Error(error)
}


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