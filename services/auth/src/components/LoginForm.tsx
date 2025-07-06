// import React, { useState, useEffect } from 'react';
// import { api } from '@packages/shared/src/routes/api';
// import { useNavigate } from 'react-router-dom';
// import cl from '@/utils/styles/modules/RegisterForm.module.scss';

// import InputData from '@packages/shared/src/components/UI/InputData/InputData';
// import ErrorMassage from '@packages/shared/src/components/UI/ErrorMassage/ErrorMassage';
// import SignWithGoogle from './UI/SignWithGoogle/SignWithGoogle';
// import Devider from './UI/Devider/Devider';
// import Terms from './UI/Terms/Terms';
// import LoginLink from './UI/LoginLink/LoginLink';
// import ButtonRegister from './UI/ButtonRegister/ButtonRegister';

// import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
// import { FormPropsType } from '@/utils/type/FormType';

// type UserLoginType = {
//     email: string;
//     password: string;
// };

// const LoginForm = () => {
//     const navigate = useNavigate();
//     const [isError, setIsError] = useState(false);
//     const [errorMessage, setErrorMessage] = useState('Помилка входу. Спробуйте ще раз');
//     const [userData, setUserData] = useState<UserLoginType>({
//         email: '',
//         password: '',
//     });

//     const { response, error, isLoading, fetchData } = useFetch<UserLoginType, any>();

//     const handleInputChange = (field: keyof UserLoginType, value: string) => {
//         setUserData(prev => ({
//             ...prev,
//             [field]: value
//         }));
//         if (isError) setIsError(false);
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         const form = e.currentTarget as HTMLFormElement;
//         if (!form.checkValidity()) {
//             form.reportValidity();
//             return;
//         }

//         fetchData({
//             method: 'POST',
//             port: 4004,
//             url: 'login',
//             body: userData,
//             event: 'login',
//         });
//     };

//     useEffect(() => {
//         if (response?.success) {
//             navigate(`/${api}/shop`, {
//                 state: { userData: response.userData }
//             });
//         }

//         if (response?.success === false || error) {
//             setIsError(true);
//             setErrorMessage(response?.message || error?.message || 'Помилка входу');
//         }
//     }, [response, error]);

//     return (
//         <div className={cl.formContainer}>
//             <SignWithGoogle />
//             <Devider />
//             <form className={cl.form} onSubmit={handleSubmit}>
//                 <InputData
//                     type="email"
//                     id="email"
//                     placeholder="your@email.com"
//                     label="Електронна пошта"
//                     required
//                     name="email"
//                     onInput={(val) => handleInputChange('email', val)}
//                 />
//                 <InputData
//                     type="password"
//                     id="password"
//                     placeholder="Не менше 8 символів"
//                     label="Пароль"
//                     required
//                     name="password"
//                     onInput={(val) => handleInputChange('password', val)}
//                 />
//                 <Terms />
//                 <ButtonRegister text={isLoading ? 'Зачекайте...' : 'Увійти'} />
//                 {isError && <ErrorMassage massage={errorMessage} />}
//             </form>

//             <LoginLink type="login" onClick={e => navigate(`/${api}/register`)} />
//         </div>
//     );
// };

// export default LoginForm;
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
import SubmitButton from '@packages/shared/src/components/UI/SubmitButton/SubmitButton';
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

    // useEffect(() => {
    //     if (isSubmit) {
    //       console.log("Відправлено   ", userData)
    //       fetchData({
    //         method: 'POST',
    //         port: 4004,
    //         url: 'login/init',
    //         body: {
    //           email: userData.email,
    //           password: userData.password,
    //         },
    //       });
    
    //     }
    //   }, [isSubmit]);

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
        <SubmitButton text={isLoading ? 'Зачекайте...' : 'Увійти'} />
        {isError && <ErrorMassage massage={errorMessage} />}
      </div>
      <LoginLink type="login" onClick={() => navigate(`/${api}/register`)} />
    </form>
  );
};

export default LoginForm;