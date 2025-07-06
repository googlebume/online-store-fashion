import React from 'react';
import cl from './ButtonOrder.module.scss'
import { on } from 'events';

type InputTipe = {
    text: string;
    img?: string | React.ComponentType<any>;
    onClick?: () => void;
}

const ButtonOrder = ({ text, img, onClick }: InputTipe) => {
    return (
        <button
            className={cl.primaryButton}
            onClick={onClick}
        >
            { img && typeof img === 'string' 
                ? <img
                src={ img }
                alt={text}
                style={{
                    width: '20px',
                    height: '20px'
                }} />
                 : <img/>}
            {text}
        </button>
    );
};

export default ButtonOrder;