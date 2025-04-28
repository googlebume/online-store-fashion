import React, { useState, useEffect } from 'react';
import { api } from '@packages/shared/src/routes/api';
import { useNavigate } from 'react-router-dom';
import cl from '@/utils/styles/modules/RegisterForm.module.scss';

import InputData from '@packages/shared/src/components/UI/InputData/InputData';
import ErrorMassage from '@packages/shared/src/components/UI/ErrorMassage/ErrorMassage';
import SignWithGoogle from './UI/SignWithGoogle/SignWithGoogle';
import Devider from './UI/Devider/Devider';
import Terms from './UI/Terms/Terms';
import LoginLink from './UI/LoginLink/LoginLink';
import ButtonRegister from './UI/ButtonRegister/ButtonRegister';
import { FormPropsType, FormType } from '@/utils/type/FormType';

export type UserRegisterType = {
    name: string;
    email: string;
    password: string;
};

const RegisterForm: React.FC<FormPropsType> = ({ setSwitchForm }) => {
    const [isError, setIsError] = useState(false);
    const [userData, setUserData] = useState<UserRegisterType>({
        name: '',
        email: '',
        password: ''
    });

    const handleInputChange = (field: keyof UserRegisterType, value: string) => {
        setUserData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    useEffect(() => {
        console.log(userData);
    }, [userData]);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const form = e.currentTarget as HTMLFormElement;
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        try {
            const response = await fetch(`http://localhost:4004/${api}/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: userData.email, password: userData.password, event: 'register' })
            });

            if (!response.ok) {
                setIsError(true);
                throw new Error(`Помилка реєстрації: ${response.statusText}`);
            }
            navigate(`/${api}/shop`);
        } catch (error) {
            setIsError(true);
            console.error('Error during registration:', error);
        }
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
                    required
                    name="name"
                    onInput={(val) => handleInputChange('name', val)}
                />
                <InputData
                    type="email"
                    id="email"
                    placeholder="your@email.com"
                    label="Електронна пошта"
                    required
                    name="email"
                    onInput={(val) => handleInputChange('email', val)}
                />
                <InputData
                    type="password"
                    id="password"
                    placeholder="Не менше 8 символів"
                    label="Пароль"
                    required
                    name="password"
                    onInput={(val) => handleInputChange('password', val)}
                />
                <Terms />
                <ButtonRegister text="Зареєструватися" />
                {isError && <ErrorMassage massage="Акаунт з такими даними зареєстровано" />}
            </form>

            <LoginLink type="register" onClick={setSwitchForm}/>
        </div>
    );
};

export default RegisterForm;
