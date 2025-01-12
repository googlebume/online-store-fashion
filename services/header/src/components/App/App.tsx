import React, {useState} from 'react';
import {Link, Outlet} from "react-router-dom";

import MainHeader from "@packages/shared/src/components/MainHeader"

export const App = () => {

    return (
        <div>
            <MainHeader />
        </div>
    );
};

