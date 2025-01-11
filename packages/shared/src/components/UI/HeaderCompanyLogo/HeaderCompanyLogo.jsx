import React from 'react';
import colours from '@packages/shared/src/utils/styles/colorScheme'
import '@packages/shared/src/utils/styles/resetStyles'
import cl from './HeaderCompanyLogo.scss'
import shopLogo from "@packages/shared/src/assets/images/logos/shopLogo.png";

const HeaderCompanyLogo = () => {
    return (
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
    );
};

export default HeaderCompanyLogo;