import React, { useState, useEffect } from 'react';
import { api } from '@packages/shared/src/routes/api';
import { useNavigate } from 'react-router-dom';
import cl from '@/utils/styles/modules/RegisterForm.module.scss';

import InputData from '@packages/shared/src/components/UI/form-controls/InputData/InputData';
import ErrorMassage from '@packages/shared/src/components/UI/ErrorMassage/ErrorMassage';
import SignWithGoogle from './UI/SignWithGoogle/SignWithGoogle';
import Devider from './UI/Devider/Devider';
import Terms from './UI/Terms/Terms';
import LoginLink from './UI/LoginLink/LoginLink';
import Button from '@packages/shared/src/components/UI/Button/Button';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';

type UserLoginType = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState<true | false>(false)
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userData, setUserData] = useState<UserLoginType>({
    email: '',
    password: '',
  });

  const { response, error, isLoading, fetchData } = useFetch<UserLoginType>();

  const handleInputChange = (field: keyof UserLoginType, value: string) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsError(false);
    console.log(userData)
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
    if (response?.success) {
      navigate(`/${api}/shop`, {
        state: { userData: response.userData },
      });
    } else if (response?.success === false) {
      setIsError(true);
      setErrorMessage(response.message || 'Помилка входу');
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      setIsError(true);
      setErrorMessage(error.message || 'Помилка входу');
    }
  }, [error]);


  useEffect(() => {
      if (response) {
        if (response.success) {
          navigate(`/${api}/verify`, { state: { email: userData.email, event: 'login' } });
          setIsSubmit(false);
        } else {
          setErrorMessage(response.message || 'Помилка реєстрації');
          setIsError(true);
          setIsSubmit(false);
        }
      }
    }, [response]);


  return (
    <form className={cl.formContainer} onSubmit={handleSubmit}>
      <SignWithGoogle />
      <Devider />
      <div className={cl.form} onSubmit={handleSubmit}>
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
        <Button text={isLoading ? 'Зачекайте...' : 'Увійти'} />
        {isError && <ErrorMassage massage={errorMessage} />}
      </div>
      <LoginLink type="login" onClick={() => navigate(`/${api}/register`)} />
    </form>
  );
};

export default LoginForm;



