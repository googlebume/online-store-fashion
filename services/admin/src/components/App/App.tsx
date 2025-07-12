import React, {useState} from 'react';
import cl from './App.module.scss'
import {Link, Outlet} from "react-router-dom";
import {deepMerge} from '@packages/shared/src/utils/deepMerge'

import AsideAdmin from '../AsideAdmin';

export const App = () => {
    // deepMerge()
    return (
        <div className={cl.wrapper}>
            <AsideAdmin />
            <div className={cl.content}>
                    <Outlet />
            </div>
        </div>
    );
};

