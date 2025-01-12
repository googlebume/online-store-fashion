import {createBrowserRouter} from "react-router-dom";
import {App} from "@/components/App/App";
import {Suspense} from "react";
import {Header} from "@/pages/Header";

const routes = [
    {
        path: "/header",
        element: <App />,

    },
]

export const router = createBrowserRouter(routes);

export default routes;