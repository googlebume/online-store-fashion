import { FormType } from '@/utils/type/FormType';
import React, { useState } from 'react';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import VerificationCodeInput, { VerificationForm } from './VerificationForm';

const AuthComponent = () => {
    const [switchForm, setSwitchForm] = useState<FormType>({ type: 'register' })
    return (
        <div>
            {
                switchForm.type === 'register' && <RegisterForm setSwitchForm={setSwitchForm} />
            }
            {
                switchForm.type === 'login' && <LoginForm setSwitchForm={setSwitchForm} />
            }
            {
                switchForm.type === 'verify' && <VerificationForm setSwitchForm={setSwitchForm} />
            }

        </div>
    );
};

export default AuthComponent;