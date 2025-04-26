import React from 'react';
import cl from './LoginLink.module.scss';
import { FormType } from '@/utils/type/FormType';

interface LoginLinkProps extends FormType {
    onClick: React.Dispatch<React.SetStateAction<FormType>>;
}


const LoginLink: React.FC<LoginLinkProps> = ({ type, onClick }) => {
    return (
        <div className={cl.loginLink}>
            {type === 'register' ? (
                <>
                    Вже маєте обліковий запис? <a href="#" onClick={() => onClick({type: 'login'})}>Увійти</a>
                </>
            ) : (
                <>
                    Не маєте облікового запису? <a href="#" onClick={() => onClick({type: 'register'})}>Зареєструватися</a>
                </>
            )}
        </div>
    );
};


export default LoginLink;
