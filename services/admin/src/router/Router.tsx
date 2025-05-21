import { createBrowserRouter, Navigate } from "react-router-dom";
import { App } from "@/components/App/App";
import { Suspense } from "react";
import { LazyAbout } from "@/pages/about/About.lazy";
import { api } from '@packages/shared/src/routes/api'

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
                path: `${api}/admin/about`,
                element: <Suspense fallback={'Loading...'}><LazyAbout /></Suspense>
            },
        ]
    },
]

export const router = createBrowserRouter(routes);

export default routes;