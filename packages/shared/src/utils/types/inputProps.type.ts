import React from "react";
import UserRegisterType from '../../../../../services/auth/src/components/RegisterForm'

export type InputPropsType = {
    type: 'text' | 'number' | 'email' | 'textarea' | 'tel' |'password';
    placeholder: string;
    id:string;
    name?: string;
    min?: number;
    max?: number;
    disabled?: boolean;
    label?: string;
    required?: boolean;
    value?: string | number | null
    onInput?: (val:string) => void
};