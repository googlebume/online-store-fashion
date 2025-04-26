import React, { useState } from 'react';
import cl from './SignWithGoogle.module.scss';
import { useNavigate } from 'react-router-dom';
import { api } from '@packages/shared/src/routes/api';

const SignWithGoogle = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleMockGoogleLogin = async () => {
    setLoading(true);

    await new Promise((res) => setTimeout(res, 2000));

    const mockUser = {
      name: 'Сергій Google',
      email: 'serhii@gmail.com',
      avatar: 'https://i.pravatar.cc/150?u=google',
      provider: 'google'
    };

    localStorage.setItem('user', JSON.stringify(mockUser));
    navigate(`/${api}/shop`);
  };

  return (
    <button
      className={cl.googleButton}
      onClick={handleMockGoogleLogin}
      disabled={loading}
    >
      <span className={cl.googleIcon}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/480px-Google_%22G%22_logo.svg.png"
          alt="Google logo"
        />
      </span>

      {loading ? 'Завантаження...' : 'Продовжити з Google'}
    </button>
  );
};

export default SignWithGoogle;
