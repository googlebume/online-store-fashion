import { FormType } from '@/utils/type/FormType';
import React, { useState } from 'react';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

const AuthComponent = () => {
    const [switchForm, setSwitchForm] = useState<FormType>({ type: 'register' })
    return (
        <div>
            {switchForm.type === 'register'
                ? <RegisterForm setSwitchForm={setSwitchForm}/>
                : <LoginForm setSwitchForm={setSwitchForm}/>}

        </div>
    );
};

export default AuthComponent;