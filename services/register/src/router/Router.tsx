import {createBrowserRouter} from "react-router-dom";
import {App} from "@/components/App/App";
import {Suspense} from "react";
import {Register} from "@/pages/Register";
import {api} from '@packages/shared/src/routes/api'

const routes = [
    {
        path: `${api}/register`,
        element: <App />,
    },
]

export const router = createBrowserRouter(routes);

export default routes;