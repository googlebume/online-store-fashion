import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import cl from '../utils/styles/modules/VerificationForm.module.scss';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
import Button from '@packages/shared/src/components/UI/Button/Button';
import { api } from '@packages/shared/src/routes/api';
import Cookies from '@packages/shared/src/utils/cookies';

interface VerificationCodeInputProps {
    length?: number;
    disabled?: boolean;
    autoFocus?: boolean;
    className?: string;
}

const cookies = new Cookies

const VerificationForm: React.FC<VerificationCodeInputProps> = ({
    length = 6,
    disabled = false,
    autoFocus = true,
    className = '',
}) => {
    const [code, setCode] = useState<string[]>(Array(length).fill(''));
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';
    const event = location.state?.event || '';
    const { response, error, fetchData, isLoading } = useFetch();

    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, length);
        if (autoFocus && inputRefs.current[0]) inputRefs.current[0].focus();
    }, [length, autoFocus]);

    useEffect(() => {
        if (response) {
            if (response.success) {
                navigate(`/${api}/login`);
            } else {
                setIsError(true);
                setErrorMessage(response.message || 'Невірний код');
            }
        }
    }, [response]);

    useEffect(() => {
        if (error) {
            setIsError(true);
            setErrorMessage(error.message || 'Помилка верифікації');
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
        const userCode: string = code.join('');
        if (userCode.length !== length) {
            setIsError(true);
            setErrorMessage('Введіть повний код');
            return;
        }
        const codeVerify = fetchData({
            method: 'POST',
            port: 4004,
            url: event === 'register' ? 'register/confirm' : 'login/confirm',
            body: { code: userCode },
        });
    };

    useEffect(() => {
        if (response && response.success === true) {
            response.token && cookies.setCookie({
                name: 'token',
                data: response?.token,
                path: `/${api}`
            })
            navigate(event === 'register' ? `/${api}/login` : `/${api}/shop`, { state: { userData: response.userData } });
        } else if (response && response.success === false) {
            setIsError(true);
            setErrorMessage(response.message || 'Невірний код');
        }
    }, [response]);

    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [convertedTime, setConvertedTime] = useState<string>("05:00");

    // -- MM:SS на рефактор/декомпозицію 
    function formatMMSS(totalSeconds: number) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    }

    useEffect(() => {
        const eventSource = new EventSource(
            "http://localhost:4004/fashion/verify/time-remaining"
        );

        eventSource.onmessage = (event: MessageEvent) => {
            try {
                const parsed = JSON.parse(event.data) as { remaining: number };
                setTimeRemaining(parsed.remaining);
            } catch {
                console.error("Не вдалося розпарсити SSE:", event.data);
            }
        };

        eventSource.onerror = () => {
            setConvertedTime("Час вийшов");
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    useEffect(() => {
        setConvertedTime(formatMMSS(timeRemaining));
    }, [timeRemaining]);

    // -- MM:SS на рефактор/декомпозицію

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
                    disabled={disabled}
                    aria-label={`Digit ${index + 1} of verification code`}
                    className={cl.codeInput}
                    autoComplete="one-time-code"
                />
            ))}
            <Button text={isLoading ? 'Зачекайте...' : 'Відправити'} />
        </form>
        {isError ? <div className={cl.error}>{errorMessage}</div> : <p>{convertedTime}</p>}
        </>
        
    );
};

export default VerificationForm;


