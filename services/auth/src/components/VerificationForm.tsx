// import React, { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
// import cl from '../utils/styles/modules/VerificationForm.module.scss';
// import { FormType } from '@/utils/type/FormType';
// import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
// import ButtonRegister from './UI/ButtonRegister/ButtonRegister';

// interface VerificationCodeInputProps {
//     setSwitchForm?: React.Dispatch<React.SetStateAction<FormType>>;
//     length?: number;
//     disabled?: boolean;
//     autoFocus?: boolean;
//     className?: string;
// }

// export const VerificationForm: React.FC<VerificationCodeInputProps> = ({
//     length = 6,
//     disabled = false,
//     autoFocus = true,
//     className = '',
// }) => {
//     const [code, setCode] = useState<string[]>(Array(length).fill(''));
//     const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

//     useEffect(() => {
//         inputRefs.current = inputRefs.current.slice(0, length);
//         if (autoFocus && inputRefs.current[0]) inputRefs.current[0].focus();
//     }, [length, autoFocus]);

//     const updateCode = (index: number, value: string) => {
//         if (!/^\d*$/.test(value)) return;
//         const updated = [...code];
//         updated[index] = value.slice(-1);
//         setCode(updated);
//         if (value && index < length - 1) inputRefs.current[index + 1]?.focus();
//     };

//     const handleKey = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
//         const updated = [...code];
//         if (e.key === 'Backspace') {
//             if (!code[index] && index > 0) {
//                 updated[index - 1] = '';
//                 setCode(updated);
//                 inputRefs.current[index - 1]?.focus();
//             } else {
//                 updated[index] = '';
//                 setCode(updated);
//             }
//         } else if (e.key === 'ArrowLeft' && index > 0) {
//             inputRefs.current[index - 1]?.focus();
//         } else if (e.key === 'ArrowRight' && index < length - 1) {
//             inputRefs.current[index + 1]?.focus();
//         }
//     };

//     const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
//         e.preventDefault();
//         const digits = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, length);
//         if (!digits) return;
//         const updated = [...code];
//         digits.split('').forEach((digit, i) => { if (i < length) updated[i] = digit; });
//         setCode(updated);
//         const nextIndex = updated.findIndex(d => !d);
//         inputRefs.current[nextIndex === -1 ? length - 1 : nextIndex]?.focus();
//     };

//     const { response, error, fetchData } = useFetch<number>();
//     useEffect(() => {
//         fetchData({
//             method: 'GET',
//             port: 4004,
//             url: 'auth/verify',
//         });
//     }, [])
//     useEffect(() => {
//         setCode(response)
//     }, [response])

//     const handleSubmit = () =>{
//         fetchData({
//             method: 'POST',
//             port: 4004,
//             url: 'auth/verify',
//             body: {userCode: code}
//         });
//     }
//     return (
//         <form className={`${cl.codeInputContainer} ${className}`} onSubmit={handleSubmit}>
//             {Array.from({ length }, (_, index) => (
//                 <input
//                     key={index}
//                     ref={el => (inputRefs.current[index] = el)}
//                     type="text"
//                     inputMode="numeric"
//                     pattern="\d*"
//                     maxLength={1}
//                     value={code[index] || ''}
//                     onChange={e => updateCode(index, e.target.value)}
//                     onKeyDown={e => handleKey(index, e)}
//                     onPaste={index === 0 ? handlePaste : undefined}
//                     onFocus={e => e.target.select()}
//                     disabled={disabled}
//                     aria-label={`Digit ${index + 1} of verification code`}
//                     className={cl.codeInput}
//                     autoComplete="one-time-code"
//                 />
//             ))}
//             <ButtonRegister
//                 text="Відправити"
//             />
//         </form>
//     );
// };

// export default VerificationForm;
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import cl from '../utils/styles/modules/VerificationForm.module.scss';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
import ButtonRegister from './UI/ButtonRegister/ButtonRegister';
import { api } from '@packages/shared/src/routes/api';

interface VerificationCodeInputProps {
    length?: number;
    disabled?: boolean;
    autoFocus?: boolean;
    className?: string;
}

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
    const { response, error, fetchData, isLoading } = useFetch();

    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, length);
        if (autoFocus && inputRefs.current[0]) inputRefs.current[0].focus();
    }, [length, autoFocus]);

    // useEffect(() => {
    //     if (!email) {
    //         setIsError(true);
    //         setErrorMessage('Email не надано');
    //     } else {
    //         // Відправляємо запит на генерацію коду
    //         fetchData({
    //             method: 'POST',
    //             port: 4004,
    //             url: 'verify',
    //             body: { email },
    //         });
    //     }
    // }, [email]);

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
            url: 'register/confirm',
            body: {code: userCode},
        });
    };

    useEffect(() => {
        if (response && response.success === true) {
            navigate(`/${api}/shop`);
        } else if (response && response.success === false) {
            setIsError(true);
            setErrorMessage(response.message || 'Невірний код');
        }
    }, [response]);


    return (
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
            <ButtonRegister text={isLoading ? 'Зачекайте...' : 'Відправити'} />
            {isError && <div className={cl.error}>{errorMessage}</div>}
        </form>
    );
};

export default VerificationForm;