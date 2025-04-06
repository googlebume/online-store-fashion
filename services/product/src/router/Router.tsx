import {createBrowserRouter} from "react-router-dom";
import {App} from "@/components/App/App";
import {Suspense} from "react";
import {Product} from "@/pages/Product";

const routes = [
    {
        path: "/shop/product",
        element: <App />,

    },
]

export const router = createBrowserRouter(routes);

export default routes;