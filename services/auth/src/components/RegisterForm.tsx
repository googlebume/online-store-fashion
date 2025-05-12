// import React, { useState, useEffect } from 'react';
// import { api } from '@packages/shared/src/routes/api';
// import { useNavigate } from 'react-router-dom';
// import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
// import cl from '@/utils/styles/modules/RegisterForm.module.scss';

// import InputData from '@packages/shared/src/components/UI/InputData/InputData';
// import ErrorMassage from '@packages/shared/src/components/UI/ErrorMassage/ErrorMassage';
// import SignWithGoogle from './UI/SignWithGoogle/SignWithGoogle';
// import Devider from './UI/Devider/Devider';
// import Terms from './UI/Terms/Terms';
// import LoginLink from './UI/LoginLink/LoginLink';
// import ButtonRegister from './UI/ButtonRegister/ButtonRegister';
// import { FormPropsType } from '@/utils/type/FormType';
// import VerificationForm from './VerificationForm';
// import { verify } from 'crypto';

// export type UserAuthType = {
//     name?: string;
//     email: string;
//     password: string;
//     event?: 'login' | 'register';
// };

// const RegisterForm = () => {
//     const [isError, setIsError] = useState(false);
//     const [errorMessage, setErrorMessage] = useState('Акаунт з такими даними зареєстровано');
//     const [userData, setUserData] = useState<UserAuthType>({
//         name: '',
//         email: '',
//         password: ''
//     });

//     const [isSubmit, setIsSubmit] = useState(false);
//     const navigate = useNavigate();

//     const { response, error, fetchData } = useFetch<UserAuthType>();

//     const handleInputChange = (field: keyof UserAuthType, value: string) => {
//         setUserData((prev) => ({
//             ...prev,
//             [field]: value
//         }));

//         setIsError(false);
//     };

//     useEffect(() => {
//         if (isSubmit) {
//             fetchData({
//                 method: 'POST',
//                 port: 4004,
//                 url: 'register',
//                 body: JSON.stringify(
//                     {
//                         name: userData.name,
//                         email: userData.email,
//                         password: userData.password,
//                         event: 'register',
//                     }
//                 )
//             });
//         }
//     }, [isSubmit]);

//     useEffect(() => {
//         if (response) {
//             if (response.error || (response as any).success === false) {
//                 const message = response.error
//                     || (response as any).message
//                     || 'Акаунт з такими даними зареєстровано';

//                 setErrorMessage(message);
//                 setIsError(true);
//                 setIsSubmit(false);
//             } else {
//                 navigate(`/${api}/verify`);
//                 // setSwitchForm({type: 'verify'})
//                 setIsSubmit(false);
//             }
//         }
//     }, [response]);

//     useEffect(() => {
//         if (error) {
//             setErrorMessage(error.message || 'Сталася помилка при реєстрації');
//             setIsError(true);
//             setIsSubmit(false);
//         }
//     }, [error]);

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         const form = e.currentTarget as HTMLFormElement;
//         if (!form.checkValidity()) {
//             form.reportValidity();
//             return;
//         }

//         setIsSubmit(true);
//     };

//     return (
//         <div className={cl.formContainer}>
//             <SignWithGoogle />
//             <Devider />
//             <form className={cl.form} onSubmit={handleSubmit}>
//                 <InputData
//                     type="text"
//                     id="name"
//                     placeholder="Введіть ваше ім'я"
//                     label="Ім'я"
//                     required
//                     name="name"
//                     onInput={(val) => handleInputChange('name', val)}
//                 />
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
//                 <ButtonRegister
//                     text="Зареєструватися"
//                 />
//                 {isError && <ErrorMassage massage={errorMessage} />}
//             </form>

//             <LoginLink type="register" onClick={e => navigate(`/${api}/login`)} />
//         </div>
//     );
// };

// export default RegisterForm;

import React, { useState, useEffect } from 'react';
import { api } from '@packages/shared/src/routes/api';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
import cl from '@/utils/styles/modules/RegisterForm.module.scss';

import InputData from '@packages/shared/src/components/UI/InputData/InputData';
import ErrorMassage from '@packages/shared/src/components/UI/ErrorMassage/ErrorMassage';
import SignWithGoogle from './UI/SignWithGoogle/SignWithGoogle';
import Devider from './UI/Devider/Devider';
import Terms from './UI/Terms/Terms';
import LoginLink from './UI/LoginLink/LoginLink';
import ButtonRegister from './UI/ButtonRegister/ButtonRegister';

export type UserAuthType = {
  name?: string;
  email: string;
  password: string;
};

const RegisterForm = () => {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userData, setUserData] = useState<UserAuthType>({
    name: '',
    email: '',
    password: '',
  });

  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const { response, error, fetchData, isLoading } = useFetch<UserAuthType>();

  const handleInputChange = (field: keyof UserAuthType, value: string) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsError(false);
    console.log(userData)
  };

  useEffect(() => {
  if (isSubmit) {
    console.log("Відправлено   ", userData)
    fetchData({
      method: 'POST',
      port: 4004,
      url: 'register/init',
      body: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      },
    });
    
  }
}, [isSubmit]);


  useEffect(() => {
  if (response) {
    if (response.success) {
      navigate(`/${api}/verify`, { state: { email: userData.email } });
      setIsSubmit(false);
    } else {
      setErrorMessage(response.message || 'Помилка реєстрації');
      setIsError(true);
      setIsSubmit(false);
    }
  }
}, [response]);


  useEffect(() => {
    if (error) {
      setErrorMessage(error.message || 'Сталася помилка при реєстрації');
      setIsError(true);
      setIsSubmit(false);
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setIsSubmit(true);
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
        <ButtonRegister text={isLoading ? 'Зачекайте...' : 'Зареєструватися'} />
        {isError && <ErrorMassage massage={errorMessage} />}
      </form>
      <LoginLink type="register" onClick={() => navigate(`/${api}/login`)} />
    </div>
  );
};

export default RegisterForm;