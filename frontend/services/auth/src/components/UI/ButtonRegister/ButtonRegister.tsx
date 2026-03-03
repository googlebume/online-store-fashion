import React from 'react';
import {api} from '@packages/shared/src/routes/api'

import cl from './ButtonRegister.module.scss'
import { ButtonRegisterType } from '@/utils/type/ButtonRegister.type';
import { Link } from 'react-router-dom';

const ButtonRegister: React.FC<ButtonRegisterType> = ({ text, onClick }) => {
    return (
            <button type="submit" className={cl.submitButton} onClick={onClick}>
                {text}
            </button>
    );
};

export default ButtonRegister;

