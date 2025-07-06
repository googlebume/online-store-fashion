import React, { useState } from 'react';
import { Routes, Route, Link, Outlet } from "react-router-dom";
import { adminRoutes } from '@packages/shared/src/routes/admin'
import { shopRoutes } from '@packages/shared/src/routes/shop'
import Layout from '@packages/shared/src/components/Layout'

import ErrorNotFound from '@packages/shared/src/components/ErrorNotFound';

export const App = () => {

    return (
        <div>
            <Layout />
        </div>
    );
};
