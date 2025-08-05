import React from 'react';
import cl from './SubmitButton.module.scss';

type SubmitButtonProps = {
    text: string;
    onClick?: () => void;
    img?: string | React.ComponentType | React.ComponentType<any>;
    variant?: 'primary' | 'secondary';
};

const SubmitButton: React.FC<SubmitButtonProps> = ({
    text,
    onClick,
    img,
    variant = 'primary'
}) => {
    const buttonClass = variant === 'secondary'
        ? `${cl.submit__button} ${cl.submit__button_secondary}`
        : cl.submit__button;

    return (
        <button
            className={buttonClass}
            onClick={onClick}
        >
            {img && typeof img === 'string'
                ? <img src={img} alt="" className={cl.submit__button_icon} />
                : React.isValidElement(img) 
                    ? img
                    : typeof img === 'function'
                        ? React.createElement(img, { className: cl.submit__button_icon })
                        : null
            }
            {text}
        </button>
    );
};

export default SubmitButton;