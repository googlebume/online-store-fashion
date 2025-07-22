import React, {useState} from 'react';
import cl from './App.module.scss'
import {Link, Outlet} from "react-router-dom";
import {deepMerge} from '@packages/shared/src/utils/deepMerge'
import { administrationListItems } from '@/utils/constants/administrationList';

import AsideList from '@packages/shared/src/components/AsideList';

export const App = () => {
    // deepMerge()
    return (
        <div className={cl.wrapper}>
            <AsideList section={ administrationListItems }/>
            <div className={cl.content}>
                    <Outlet />
            </div>
        </div>
    );
};

