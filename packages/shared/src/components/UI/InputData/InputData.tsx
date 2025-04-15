import React from 'react';
import cl from './InputData.module.scss';
import { InputPropsType } from './../../../utils/types/inputProps.type';

const InputData: React.FC<InputPropsType> = ({ type, placeholder, label, min, max, id, required }) => {
    const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
        type,
        className: cl.input,
        id,
        placeholder,
        min,
        max,
        required,
    };

    if (type === 'password') {
        inputProps.minLength = 8;
        inputProps.title = 'Пароль повинен містити щонайменше 8 символів';
    }

    if (type === 'email') {
        inputProps.pattern = '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$';
        inputProps.title = 'Введіть коректну email-адресу, наприклад: name@gmail.com';
    }

    return (
        <div className={cl.inputContainer}>
            <label className={cl.label} htmlFor={id}>
                {label}
            </label>
            <input {...inputProps} />
        </div>
    );
};

export default InputData;
