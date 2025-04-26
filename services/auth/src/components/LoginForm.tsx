import React from 'react';

import { api } from '@packages/shared/src/routes/api'
import { useNavigate } from 'react-router-dom'
import cl from '@/utils/styles/modules/RegisterForm.module.scss'

import InputData from '@packages/shared/src/components/UI/InputData/InputData'
import ErrorMassage from '@packages/shared/src/components/UI/ErrorMassage/ErrorMassage'
import SignWithGoogle from './UI/SignWithGoogle/SignWithGoogle';
import Devider from './UI/Devider/Devider';
import Terms from './UI/Terms/Terms';
import LoginLink from './UI/LoginLink/LoginLink';
import ButtonRegister from './UI/ButtonRegister/ButtonRegister';

const LoginForm = () => {
    return (
        <div className={cl.formContainer}>
            <SignWithGoogle />
            <Devider />
            <form className={cl.form} onSubmit={handleSubmit}>
                <InputData
                    type="email"
                    id="email"
                    placeholder="your@email.com"
                    label='Електронна пошта'
                    required
                    name="email"
                    onInput={(val) => handleInputChange('email', val)}
                />
                <InputData
                    type="password"
                    id="password"
                    placeholder="Не менше 8 символів"
                    label='Пароль'
                    required
                    name="password"
                    onInput={(val) => handleInputChange('password', val)}
                />
                <Terms />
                <ButtonRegister text='Зареєструватися' />
                {isError && <ErrorMassage massage='Помилка реєстрації. Спробуйте ще раз'/>}
            </form>

            <LoginLink />
        </div>
    );
};

export default LoginForm;