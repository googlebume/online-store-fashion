import {createBrowserRouter} from "react-router-dom";
import {App} from "@/components/App/App";
import {Suspense} from "react";
import {Shop} from "@/pages/Shop";
import {UserCard} from "@packages/shared/src/components/UserCard";
import {api} from '@packages/shared/src/routes/api'

const routes = [
    {
        path: `${api}/shop`,
        element: <App />,
        children: [
            {
                path: `${api}/shop/main`,
                element: <Suspense fallback={'Loading...'}><Shop /></Suspense>
            },
            {
                path: `${api}/shop/second`,
                element: <Suspense fallback={'Loading...'}></Suspense>
            },
        ]
    },
]

export const router = createBrowserRouter(routes);

export default routes;