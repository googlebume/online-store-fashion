import React from 'react';
import cl from './InputData.module.scss';
import { InputPropsType } from './../../../utils/types/inputProps.type';

const InputData: React.FC<InputPropsType> = ({ type, placeholder, label, min, max, id, required, value, onInput }) => {
    const baseProps = {
        className: cl.input,
        id,
        placeholder,
        required,
        value,
    };

    const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
        ...baseProps,
        type,
        min,
        max,
    };

    const textareaProps: React.TextareaHTMLAttributes<HTMLTextAreaElement> = {
        ...baseProps,
        rows: 4,
    };


    if (type === 'password') {
        inputProps.minLength = 8;
        inputProps.title = 'Пароль повинен містити щонайменше 8 символів';
    }

    if (type === 'email') {
        inputProps.pattern = '[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}';
    }

    return (
        <div className={cl.inputContainer}>
            <label className={cl.label} htmlFor={id}>
                {label}
            </label>
            {
                type === 'textarea'
                    ? <textarea
                        {...textareaProps}
                        onInput={(e) => { onInput && onInput(e.currentTarget.value) }}
                    />
                    : <input
                        {...inputProps}
                        onInput={(e) => { onInput && onInput(e.currentTarget.value) }}
                    />
            }
        </div>
    );
};

export default InputData;