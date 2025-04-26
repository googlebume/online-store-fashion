import React from 'react';
import {authRoutes} from '@packages/shared/src/routes/auth'
import {Link} from "react-router-dom";

const Register = () => {
    return (
        <h1>
            register
            <div>
                <Link to={authRoutes.auth}>go to second page</Link>
            </div>
        </h1>
    );
};

export default Register;