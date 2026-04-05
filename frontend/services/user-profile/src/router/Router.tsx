import {createBrowserRouter, Navigate} from "react-router-dom";
import {App} from "@/components/App/App";
import {api} from '@packages/shared/src/routes/api'
import UserProfilePage from "@/pages/UserProfile/UserProfilePage";

const routes = [
    {
        index: true,
        element: <Navigate to={`/${api}/user-profile`} replace />
    },
    {
        path: `${api}/user-profile`,
        element: <App />,
        children: [
            {
                index: true,
                element: <UserProfilePage />,
            },
        ]
    },
    {
        path: `${api}/user-profile/:id`,
        element: <App />,
        children: [
            {
                index: true,
                element: <UserProfilePage />,
            },
        ]
    },
]

export const router = createBrowserRouter(routes);

export default routes;
