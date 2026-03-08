import React, { useState, useEffect } from 'react';
import { api } from '@packages/shared/src/routes/api';
import { useNavigate } from 'react-router-dom';
import cl from '@/utils/styles/modules/RegisterForm.module.scss';

import InputData from '@packages/shared/src/components/UI/form-controls/InputData/InputData';
import ErrorMassage from '@packages/shared/src/components/UI/ErrorMassage/ErrorMassage';
import SignWithGoogle from '@/components/UI/SignWithGoogle/SignWithGoogle';
import Devider from '@/components/UI/Devider/Devider';
import Terms from '@/components/UI/Terms/Terms';
import LoginLink from '@/components/UI/LoginLink/LoginLink';
import Button from '@packages/shared/src/components/UI/Button/Button';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';

type UserLoginType = {
  email: string;
  password: string;
};

type InitAuthResponse = {
  success?: boolean;
  flowId?: string;
  message?: string;
};

const Login = () => {
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userData, setUserData] = useState<UserLoginType>({
    email: '',
    password: '',
  });

  const { response, error, isLoading, fetchData } = useFetch<UserLoginType, InitAuthResponse>();

  const handleInputChange = (field: keyof UserLoginType, value: string) => {
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
      port: 4004,
      url: 'login/init',
      body: userData,
    });
  };

  useEffect(() => {
    if (!response) return;

    if (response.success && response.flowId) {
      navigate(`/${api}/verify`, {
        state: { email: userData.email, event: 'login', flowId: response.flowId },
      });
      return;
    }

    setIsError(true);
    setErrorMessage(response.message || 'Login initialization failed');
  }, [response]);

  useEffect(() => {
    if (error) {
      setIsError(true);
      setErrorMessage(error.message || 'Login error');
    }
  }, [error]);

  return (
    <div className={cl.formContainer}>
      <SignWithGoogle />
      <form onSubmit={handleSubmit}>
        <Devider />
        <div className={cl.form}>
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
          <Button text={isLoading ? 'Loading...' : 'Увійти'} />
          {isError && <ErrorMassage massage={errorMessage} />}
        </div>
        <LoginLink type="login" onClick={() => navigate(`/${api}/register`)} />
      </form>
    </div>
  );
};

export default Login;
