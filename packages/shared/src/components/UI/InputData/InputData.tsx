import React from 'react';
import cl from './InputData.module.scss';
import { InputPropsType } from './../../../utils/types/inputProps.type';

const InputData: React.FC<InputPropsType> = ({ type, placeholder, label, min, max, id, required, onInput }) => {
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
        inputProps.pattern = '[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}';
    }

    return (
        <div className={cl.inputContainer}>
            <label className={cl.label} htmlFor={id}>
                {label}
            </label>
            <input 
                {...inputProps} 
                onInput={(e) => {onInput(e.currentTarget.value)}}
            />
        </div>
    );
};

export default InputData;
