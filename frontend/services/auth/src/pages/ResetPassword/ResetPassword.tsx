import React, { useState, useEffect } from 'react';
import { api } from '@packages/shared/src/routes/api';
import { useNavigate } from 'react-router-dom';
import cl from '@/utils/styles/modules/RegisterForm.module.scss';
import rcl from './ResetPassword.module.scss';
import InputData from '@packages/shared/src/components/UI/form-controls/InputData/InputData';
import ErrorMassage from '@packages/shared/src/components/UI/ErrorMassage/ErrorMassage';
import Button from '@packages/shared/src/components/UI/Button/Button';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';

type ResetPasswordForm = {
  email: string;
  newPassword: string;
  confirmPassword: string;
};

type InitResetResponse = {
  success?: boolean;
  flowId?: string;
  message?: string;
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<ResetPasswordForm>({ email: '', newPassword: '', confirmPassword: '' });
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { response, error, isLoading, fetchData } = useFetch<{ email: string; newPassword: string }, InitResetResponse>();

  const handleInput = (field: keyof ResetPasswordForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const htmlForm = e.currentTarget as HTMLFormElement;
    if (!htmlForm.checkValidity()) { htmlForm.reportValidity(); return; }
    if (form.newPassword !== form.confirmPassword) {
      setIsError(true);
      setErrorMessage('Паролі не співпадають');
      return;
    }
    fetchData({ method: 'POST', port: 5003, url: 'forgot-password/init', body: { email: form.email, newPassword: form.newPassword } });
  };

  useEffect(() => {
    if (!response) return;
    if (response.success && response.flowId) {
      navigate(`/${api}/verify`, { state: { email: form.email, event: 'reset-password', flowId: response.flowId } });
      return;
    }
    setIsError(true);
    setErrorMessage(response.message || 'Не вдалося скинути пароль');
  }, [response]);

  useEffect(() => {
    if (error) { setIsError(true); setErrorMessage(error.message || 'Помилка скидання паролю'); }
  }, [error]);

  return (
    <div className={cl.formContainer}>
      <form onSubmit={handleSubmit}>
        <div className={cl.form}>
          <h2 className={rcl.title}>Зміна паролю</h2>
          <InputData type="email" id="email" placeholder="your@email.com" label="Електронна пошта" required name="email" onInput={(val: string) => handleInput('email', val)} />
          <InputData type="password" id="newPassword" placeholder="Новий пароль" label="Новий пароль" required name="newPassword" onInput={(val: string) => handleInput('newPassword', val)} />
          <InputData type="password" id="confirmPassword" placeholder="Підтвердіть пароль" label="Підтвердіть пароль" required name="confirmPassword" onInput={(val: string) => handleInput('confirmPassword', val)} />
          <Button text={isLoading ? 'Завантаження...' : 'Надіслати код'} />
          {isError && <ErrorMassage massage={errorMessage} />}
        </div>
        <div className={rcl.backLink}>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate(`/${api}/login`); }}>← Назад до входу</a>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
