import {createBrowserRouter, Navigate} from "react-router-dom";
import {App} from "@/components/App/App";
import {Suspense} from "react";
import {api} from '@packages/shared/src/routes/api'

const routes = [
    {
        index: true,
        element: <Navigate to={`/${api}/user-profile`} replace />
    },
    {
        path: `${api}/user-profile`,
        element: <App />,
        children: [
        ]
    },
    {
        path: `${api}/user-profile/:id`,
        element: <App />,
        children: [
        ]
    },
]

export const router = createBrowserRouter(routes);

export default routes;
