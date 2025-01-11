import {createBrowserRouter} from "react-router-dom";
import {App} from "@/components/App/App";
import {Suspense} from "react";
import {Header} from "@/pages/Header";

const routes = [
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: '/main',
                element: <Suspense fallback={'Loading...'}><Header /></Suspense>
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