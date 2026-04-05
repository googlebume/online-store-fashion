import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import cl from '@/utils/styles/modules/VerificationForm.module.scss';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
import Button from '@packages/shared/src/components/UI/Button/Button';
import { api } from '@packages/shared/src/routes/api';
import Cookies from '@packages/shared/src/utils/cookies';
import { currentUserActions } from '@packages/shared/src/store';
import { UserDataType } from '@packages/shared/src/utils/types/userData.type';

interface VerificationCodeInputProps {
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

type ConfirmResponse = {
  success?: boolean;
  token?: string;
  userData?: any;
  message?: string;
};

const cookies = new Cookies();

const Verify: React.FC<VerificationCodeInputProps> = ({
  length = 6,
  disabled = false,
  autoFocus = true,
  className = '',
}) => {
  const dispatch = useDispatch();
  const [code, setCode] = useState<string[]>(Array(length).fill(''));
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const flowId = location.state?.flowId || '';
  const event = location.state?.event || '';

  const { response, error, fetchData, isLoading } = useFetch<
    { code: string; flowId: string },
    ConfirmResponse
  >();

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
    if (autoFocus && inputRefs.current[0]) inputRefs.current[0].focus();
  }, [length, autoFocus]);

  useEffect(() => {
    if (!flowId) {
      setIsError(true);
      setErrorMessage('OTP session is missing. Please login/register again.');
    }
  }, [flowId]);

  useEffect(() => {
    if (!response) return;

    if (response.success) {
      if (response.userData) {
        const currentUser: UserDataType = {
          id: response.userData.id,
          name: response.userData.name,
          email: response.userData.email,
          role: Array.isArray(response.userData.role)
            ? response.userData.role
            : [response.userData.role],
          avatar: response.userData.avatar ?? null,
          createdAt: response.userData.createdAt,
        };
        dispatch(currentUserActions.setCurrentUser(currentUser));
      }

      if (response.token) {
        cookies.setCookie({
          name: 'token',
          data: response.token,
          path: `/${api}`,
        });
      }

      navigate(`/${api}/shop`, { state: { userData: response.userData } });
      return;
    }

    setIsError(true);
    setErrorMessage(response.message || 'Код не валідний');
  }, [response, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      setIsError(true);
      setErrorMessage(error.message || 'OTP verification failed');
    }
  }, [error]);

  const updateCode = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...code];
    updated[index] = value.slice(-1);
    setCode(updated);
    if (value && index < length - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKey = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const updated = [...code];
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        updated[index - 1] = '';
        setCode(updated);
        inputRefs.current[index - 1]?.focus();
      } else {
        updated[index] = '';
        setCode(updated);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, length);
    if (!digits) return;
    const updated = [...code];
    digits.split('').forEach((digit, i) => {
      if (i < length) updated[i] = digit;
    });
    setCode(updated);
    const nextIndex = updated.findIndex((d) => !d);
    inputRefs.current[nextIndex === -1 ? length - 1 : nextIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flowId) return;

    const userCode = code.join('');
    if (userCode.length !== length) {
      setIsError(true);
      setErrorMessage('Код не заповнений');
      return;
    }

    fetchData({
      method: 'POST',
      port: 4004,
      url: event === 'register' ? 'register/confirm' : 'login/confirm',
      body: { code: userCode, flowId },
    });
  };

  const [convertedTime, setConvertedTime] = useState<string>('05:00');

  const formatMMSS = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!flowId) return;

    const eventSource = new EventSource(
      `http://localhost:4004/fashion/verify/time-remaining?flowId=${encodeURIComponent(flowId)}`,
    );

    eventSource.onmessage = (evt: MessageEvent) => {
      try {
        const parsed = JSON.parse(evt.data) as { remaining: number };
        setConvertedTime(formatMMSS(Math.max(parsed.remaining, 0)));
      } catch {
        setConvertedTime('00:00');
      }
    };

    eventSource.onerror = () => {
      setConvertedTime('00:00');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [flowId]);

  return (
    <>
      <form className={`${cl.codeInputContainer} ${className}`} onSubmit={handleSubmit}>
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={code[index] || ''}
            onChange={(e) => updateCode(index, e.target.value)}
            onKeyDown={(e) => handleKey(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            onFocus={(e) => e.target.select()}
            disabled={disabled || !flowId}
            aria-label={`Digit ${index + 1} of verification code`}
            className={cl.codeInput}
            autoComplete="one-time-code"
          />
        ))}
        <Button text={isLoading ? 'Loading...' : 'Перевірити'} />
      </form>
      {isError ? <div className={cl.error}>{errorMessage}</div> : <p>{convertedTime}</p>}
    </>
  );
};

export default Verify;
