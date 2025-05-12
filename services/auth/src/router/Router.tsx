import { createBrowserRouter } from "react-router-dom";
import { App } from "@/components/App/App";
import { Suspense } from "react";
import { Register } from "@/pages/Register";
import { api } from '@packages/shared/src/routes/api'
import VerificationForm from "@/components/VerificationForm";
import RegisterForm from "@/components/RegisterForm";
import LoginForm from "@/components/LoginForm";

const routes = [
    {
        path: `${api}`,
        element: <App />,
        children: [
            {
                path: `register`,
                element: <Suspense fallback={'Loading...'}><RegisterForm /></Suspense>
            },
            {
                path: `login`,
                element: <Suspense fallback={'Loading...'}><LoginForm /></Suspense>
            },
            {
                path: `verify`,
                element: <Suspense fallback={'Loading...'}><VerificationForm /></Suspense>
            },
        ]
    },
]

export const router = createBrowserRouter(routes);

export default routes;