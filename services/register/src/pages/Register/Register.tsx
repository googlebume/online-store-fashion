import React from 'react';
import {registerRoutes} from '@packages/shared/src/routes/register'
import {Link} from "react-router-dom";

const Register = () => {
    return (
        <h1>
            register
            <div>
                <Link to={registerRoutes.register}>go to second page</Link>
            </div>
        </h1>
    );
};

export default Register;