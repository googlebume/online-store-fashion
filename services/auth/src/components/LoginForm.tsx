import React, { useEffect, useState } from 'react';

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
import { FormPropsType, FormType } from '@/utils/type/FormType';

type UserLoginType = {
    email: string;
    password: string;
}
const LoginForm: React.FC<FormPropsType> = ({setSwitchForm}) => {
    const [isError, setIsError] = useState(false);
    const [userData, setUserData] = useState<UserLoginType>({
        email: '',
        password: '',
    })

    const handleInputChange = (field: keyof UserLoginType, value: string) => {
        setUserData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    useEffect(() => {
        console.log(userData)
    }, [userData])



    return (
        <div className={cl.formContainer}>
            <SignWithGoogle />
            <Devider />
            <form className={cl.form}>{/*onSubmit={handleSubmit}*/}
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
                <ButtonRegister text='Увійти' />
                {isError && <ErrorMassage massage='Помилка входу. Спробуйте ще раз' />}
            </form>

            <LoginLink type='login' onClick={setSwitchForm}/>
        </div>
    )
};

export default LoginForm;