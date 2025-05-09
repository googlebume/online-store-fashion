import {createBrowserRouter} from "react-router-dom";
import {App} from "@/components/App/App";
import {Suspense} from "react";
import {Register} from "@/pages/Register";
import {api} from '@packages/shared/src/routes/api'

const routes = [
    {
        path: `${api}/auth`,
        element: <App />,
        // children: [
        //     {
        //         path: `register`,
        //         element: <Suspense fallback={'Loading...'}><App /></Suspense>
        //     },
        //     {
        //         path: `login`,
        //         element: <Suspense fallback={'Loading...'}>1234</Suspense>
        //     },
        // ]
    },
]

export const router = createBrowserRouter(routes);

export default routes;