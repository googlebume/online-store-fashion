import React from 'react';
import cl from './PaymentSystems.module.scss'

import mastercardImg from '@packages/shared/src/assets/images/logos/mastercardPaymentSystem.png'
import visaImg from '@packages/shared/src/assets/images/logos/visaPaymentSystem.png'

const PaymentSystems = () => {
    return (
        <div className={cl.other__bunk}>
            <div className={cl.bunk__logo}>
                <img src={mastercardImg} alt="124" className={cl.logo__image} />
            </div>
            <div className={cl.bunk__logo}>
                <img src={visaImg} alt="" className={cl.logo__image} />
            </div>
        </div>
    );
};

export default PaymentSystems;


