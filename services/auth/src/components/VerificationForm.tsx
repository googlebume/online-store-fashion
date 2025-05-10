import React, { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import cl from '../utils/styles/modules/VerificationForm.module.scss';
import { FormType } from '@/utils/type/FormType';

interface VerificationCodeInputProps {
    setSwitchForm?: React.Dispatch<React.SetStateAction<FormType>>;
    length?: number;
    disabled?: boolean;
    autoFocus?: boolean;
    className?: string;
}

export const VerificationForm: React.FC<VerificationCodeInputProps> = ({
    length = 6,
    disabled = false,
    autoFocus = true,
    className = '',
}) => {
    const [code, setCode] = useState<string[]>(Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, length);
        if (autoFocus && inputRefs.current[0]) inputRefs.current[0].focus();
    }, [length, autoFocus]);

    const updateCode = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const updated = [...code];
        updated[index] = value.slice(-1);
        setCode(updated);
        if (value && index < length - 1) inputRefs.current[index + 1]?.focus();
    };

    const handleKey = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
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

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const digits = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, length);
        if (!digits) return;
        const updated = [...code];
        digits.split('').forEach((digit, i) => { if (i < length) updated[i] = digit; });
        setCode(updated);
        const nextIndex = updated.findIndex(d => !d);
        inputRefs.current[nextIndex === -1 ? length - 1 : nextIndex]?.focus();
    };

    return (
        <div className={`${cl.codeInputContainer} ${className}`}>
            {Array.from({ length }, (_, index) => (
                <input
                    key={index}
                    ref={el => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={1}
                    value={code[index] || ''}
                    onChange={e => updateCode(index, e.target.value)}
                    onKeyDown={e => handleKey(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    onFocus={e => e.target.select()}
                    disabled={disabled}
                    aria-label={`Digit ${index + 1} of verification code`}
                    className={cl.codeInput}
                    autoComplete="one-time-code"
                />
            ))}
        </div>
    );
};

export default VerificationForm;
