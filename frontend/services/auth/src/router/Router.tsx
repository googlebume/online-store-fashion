import { createBrowserRouter, Navigate } from 'react-router-dom';
import { App } from '@/components/App/App';
import { Suspense } from 'react';
import { Register } from '@/pages/Register';
import { Login } from '@/pages/Login';
import { Verify } from '@/pages/Verify';
import { api } from '@packages/shared/src/routes/api';

const routes = [
  {
    index: true,
    element: <Navigate to={`/${api}/register`} replace />,
  },
  {
    path: `${api}`,
    element: <App />,
    children: [
      {
        path: 'register',
        element: (
          <Suspense fallback={'Loading...'}>
            <Register />
          </Suspense>
        ),
      },
      {
        path: 'login',
        element: (
          <Suspense fallback={'Loading...'}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: 'verify',
        element: (
          <Suspense fallback={'Loading...'}>
            <Verify />
          </Suspense>
        ),
      },
    ],
  },
];

export const router = createBrowserRouter(routes);

export default routes;
