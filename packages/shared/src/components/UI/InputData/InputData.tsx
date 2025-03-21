import React from 'react';
import cl from './InputData.module.scss'
import {InputPropsType} from './../../../utils/types/inputProps.type'

const InputData: React.FC<InputPropsType> = ({type, placeholder, label, min, max}) => {
    return (
        <div className={cl.inputContainer}>
            <label className={cl.label}>{label}</label>
            <input type={type} className={cl.input} placeholder={placeholder} min={min} max={max}/>
        </div>
    );
};

export default InputData;