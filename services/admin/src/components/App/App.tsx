import React, {useState} from 'react';
import {Link, Outlet} from "react-router-dom";
import {deepMerge} from '@packages/shared/src/utils/deepMerge'

import {UserCard} from "@packages/shared/src/components/UserCard";
import AsideAdmin from '../AsideAdmin';

export const App = () => {
    deepMerge()
    return (
        <div className="wrapper">
            <AsideAdmin />
        </div>
    );
};

