import {createBrowserRouter} from "react-router-dom";
import {App} from "@/components/App/App";
import {Suspense} from "react";
import {Shop} from "@/pages/Shop";
import {UserCard} from "@packages/shared/src/components/UserCard";

const routes = [
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: '/main',
                element: <Suspense fallback={'Loading...'}><Shop /></Suspense>
            },
            {
                path: '/second',
                element: <Suspense fallback={'Loading...'}>
                </Suspense>
            },
        ]
    },
]

export const router = createBrowserRouter(routes);

export default routes;