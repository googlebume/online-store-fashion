import React from "react";
import {UserRegisterType} from '../../../../../services/auth/src/components/RegisterForm'

export type InputPropsType = {
    type: string;
    placeholder: string;
    id:string;
    name?: string;
    min?: number;
    max?: number;
    disabled?: boolean;
    label?: string;
    required?: boolean;
    onInput?: (val:string) => void
};