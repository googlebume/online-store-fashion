import {createBrowserRouter} from "react-router-dom";
import {App} from "@/components/App/App";
import {api} from '@packages/shared/src/routes/api'

// @ts-ignore
import productRoutes from 'product/Router';
// @ts-ignore
import shopRoutes from 'shop/Router';
// @ts-ignore
import adminRoutes from 'admin/Router';
// @ts-ignore
import authRoutes from 'auth/Router'



export const router = createBrowserRouter([
    {
        path: `/`,
        element: <App />,
        children: [
            ...productRoutes,
            ...shopRoutes,
            ...adminRoutes,
            ...authRoutes,
        ]
    },
]);