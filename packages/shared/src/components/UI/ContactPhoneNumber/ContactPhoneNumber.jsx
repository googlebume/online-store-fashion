import React from 'react';

import cl from './ContactPhoneNumber.module.scss';

const ContactPhoneNumber = () => {
    return (
        <div className={cl.about__phone_number}>
            <div className={cl.phone_number__numbers}>
                <h2>+380 067 387 4243</h2>
                <h2>+380 096 610 5602</h2>
            </div>
        </div>
    );
};

export default ContactPhoneNumber;