import React, { useState, useEffect } from 'react';
import { api } from '@packages/shared/src/routes/api';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
import cl from '@/utils/styles/modules/RegisterForm.module.scss';

import InputData from '@packages/shared/src/components/UI/form-controls/InputData/InputData';
import ErrorMassage from '@packages/shared/src/components/UI/ErrorMassage/ErrorMassage';
import SignWithGoogle from '@/components/UI/SignWithGoogle/SignWithGoogle';
import Devider from '@/components/UI/Devider/Devider';
import Terms from '@/components/UI/Terms/Terms';
import LoginLink from '@/components/UI/LoginLink/LoginLink';
import Button from '@packages/shared/src/components/UI/Button/Button';

export type UserAuthType = {
  name?: string;
  email: string;
  password: string;
};

type InitAuthResponse = {
  success?: boolean;
  flowId?: string;
  message?: string;
};

const Register = () => {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userData, setUserData] = useState<UserAuthType>({
    name: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const { response, error, fetchData, isLoading } = useFetch<UserAuthType, InitAuthResponse>();

  const handleInputChange = (field: keyof UserAuthType, value: string) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    fetchData({
      method: 'POST',
      port: 5003,
      url: 'register/init',
      body: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      },
    });
  };

  useEffect(() => {
    if (!response) return;

    if (response.success && response.flowId) {
      navigate(`/${api}/verify`, {
        state: { email: userData.email, event: 'register', flowId: response.flowId },
      });
      return;
    }

    setErrorMessage(response.message || 'Registration initialization failed');
    setIsError(true);
  }, [response]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error.message || 'Registration error');
      setIsError(true);
    }
  }, [error]);

  return (
    <div className={cl.formContainer}>
      <SignWithGoogle />
      <form onSubmit={handleSubmit}>
        <Devider />
        <div className={cl.form}>
          <InputData
            type="text"
            id="name"
            placeholder="Ім'я"
            label="Ім'я"
            required
            name="name"
            onInput={(val: string) => handleInputChange('name', val)}
          />
          <InputData
            type="email"
            id="email"
            placeholder="your@email.com"
            label="Електронна пошта"
            required
            name="email"
            onInput={(val: string) => handleInputChange('email', val)}
          />
          <InputData
            type="password"
            id="password"
            placeholder="Не менше 8 символів"
          label="Пароль"
            required
            name="password"
            onInput={(val: string) => handleInputChange('password', val)}
          />
          <Terms />
          <Button text={isLoading ? 'Loading...' : 'Зареєстуватися'} />
          {isError && <ErrorMassage massage={errorMessage} />}
        </div>
        <LoginLink type="register" onClick={() => navigate(`/${api}/login`)} />
      </form>
    </div>
  );
};

export default Register;
