import React from 'react';
import {api} from '@packages/shared/src/routes/api'
import { useNavigate } from 'react-router-dom'
import cl from '@/utils/styles/RegisterForm.module.scss'

import InputData from '@packages/shared/src/components/UI/InputData/InputData'
import SignWithGoogle from './UI/SignWithGoogle/SignWithGoogle';
import Devider from './UI/Devider/Devider';
import Terms from './UI/Terms/Terms';
import LoginLink from './UI/LoginLink/LoginLink';
import ButtonRegister from './UI/ButtonRegister/ButtonRegister';

const RegisterForm = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const form = e.currentTarget as HTMLFormElement;
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // TODO: на цьому місці мала б бути відправка запиту :(

        navigate(`/${api}/shop`);
    };

    return (
        <div className={cl.formContainer}>
            <SignWithGoogle />
            <Devider />
            <form className={cl.form} onSubmit={handleSubmit}>
                <InputData
                    type="text"
                    id="name"
                    placeholder="Введіть ваше ім'я"
                    label="Ім'я"
                    required={true}
                />
                <InputData
                    type="email"
                    id="email"
                    placeholder="your@email.com"
                    label='Електронна пошта'
                    required={true}
                />
                <InputData
                    type="password"
                    id="password"
                    placeholder="Не менше 8 символів"
                    label='Пароль'
                    required={true}
                />
                <Terms />
                <ButtonRegister text='Зареєструватися' />
            </form>
            <LoginLink />
        </div>
    );
};

export default RegisterForm;