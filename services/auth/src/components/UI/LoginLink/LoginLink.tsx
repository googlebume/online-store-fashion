import React from 'react';
import cl from './LoginLink.module.scss'

const LoginLink = () => {
    return (
        <div className={cl.loginLink}>
            Вже маєте обліковий запис? <a href="#">Увійти</a>
        </div>
    );
};

export default LoginLink;