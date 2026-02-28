import React from 'react';
import {api} from '../../../routes/api'
import colours from '@packages/shared/src/utils/styles/colorScheme'
import '@packages/shared/src/utils/styles/resetStyles'
import cl from './CompanyLogo.scss'
import shopLogo from "@packages/shared/src/assets/images/logos/shopLogo.png";
import { Link } from 'react-router-dom';

const CompanyLogo = () => {
    return (
        <Link to={`http://localhost:3000/${api}/shop`}>
            <div className={cl.header__company}>
                <div className={cl.company__logo}>
                    <img className={cl.logo__img} src={shopLogo} alt="companyLogo" />
                </div>
                <div className={cl.company__naming}>
                    <h3 className={cl.company__name}>
                        Fashion
                    </h3>
                </div>
            </div>
        </Link>
    );
};

export default CompanyLogo;


