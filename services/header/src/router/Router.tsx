import {createBrowserRouter} from "react-router-dom";
import {App} from "@/components/App/App";
import {Suspense} from "react";
import {Header} from "@/pages/Header";
import {UserCard} from "@packages/shared/src/components/UserCard";

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
                    <div style={{color: 'red'}}>
                        <h1>header page</h1>
                        <UserCard username={'FROM SHOP'} />
                    </div>
                </Suspense>
            },
        ]
    },
]

export const router = createBrowserRouter(routes);

export default routes;