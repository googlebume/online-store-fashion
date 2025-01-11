import React from 'react';
import {headerRoutes} from '@packages/shared/src/routes/header'
import {Link} from "react-router-dom";

const Header = () => {
    return (
        <h1>
            HEADER
            <div>
                <Link to={headerRoutes.result}>go to second page</Link>
            </div>
        </h1>
    );
};

export default Header;