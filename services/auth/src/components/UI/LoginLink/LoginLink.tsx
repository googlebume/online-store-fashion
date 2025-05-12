import React from 'react';
import cl from './LoginLink.module.scss';
import { FormType } from '@/utils/type/FormType';

interface LoginLinkProps extends FormType {
    onClick: any;
}

const LoginLink: React.FC<LoginLinkProps> = ({ type, onClick }) => {
    return (
        <div className={cl.loginLink}>
            {type === 'register' ? (
                <>
                    Вже маєте обліковий запис? <a href="#" onClick={(e) => { e.preventDefault(); onClick(e); }}>Увійти</a>
                </>
            ) : (
                <>
                    Не маєте облікового запису? <a href="#" onClick={(e) => { e.preventDefault(); onClick(e); }}>Зареєструватися</a>
                </>
            )}
        </div>
    );
};


export default LoginLink;
