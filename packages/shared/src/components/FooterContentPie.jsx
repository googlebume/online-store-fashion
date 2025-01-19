import React from 'react';
import cl from '@packages/shared/src/utils/styles/FooterContentPie.module.scss'

import SotialNetworks from './UI/SotialNetworks/SotialNetworks';
import FooterCopyright from './UI/FooterCopyright/FooterCopyright';
import PaymentSystems from './UI/PaymentSystems/PaymentSystems';
import FooterUsefulLinks from './FooterUsefulLinks';
import ContactPhoneNumber from './UI/ContactPhoneNumber/ContactPhoneNumber';
import CompanyLogo from './UI/CompanyLogo/CompanyLogo';

const FooterContentPie = () => {
    return (
        <div className={cl.footer__content}>
            <div className={cl.content__info}>
                <div className={cl.info__about}>
                    <CompanyLogo />
                    <ContactPhoneNumber />
                </div>
                <FooterUsefulLinks />
            </div>
            <div className={cl.footer_info__other}>
                <SotialNetworks />
                <PaymentSystems />
            </div>
            <FooterCopyright />
        </div>
    );
};

export default FooterContentPie;