import {createBrowserRouter} from "react-router-dom";
import {App} from "@/components/App/App";
import {Suspense} from "react";
import {Product} from "@/pages/Product";
import {api} from '@packages/shared/src/routes/api'

const routes = [
    {
        path: `${api}/shop/product/:name`,
        element: <App />,

    },
]

export const router = createBrowserRouter(routes);

export default routes;