import React from "react";
import UserRegisterType from '../../../../../services/auth/src/components/RegisterForm'

export type InputPropsType = {
    type: DeclaredInputTypes;
    placeholder: string;
    id: string;
    name?: string;
    min?: number;
    max?: number;
    disabled?: boolean;
    label?: string;
    required?: boolean;
    value?: string | number | null
    onInput?: (val: string) => void

};

export type DeclaredInputTypes = 'text' | 'number' | 'email' | 'textarea' | 'tel' | 'password'

export interface TextareaType extends InputPropsType {
    rows: number,
    minLength: number,
    maxLength: number
}

export type UnionInputTypes = InputPropsType | TextareaType