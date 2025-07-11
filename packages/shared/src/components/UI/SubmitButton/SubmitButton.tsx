import React from 'react';
import cl from './SubmitButton.module.scss';

type SubmitButtonProps = {
    text: string;
    onClick?: () => void;
    img?: string | React.ComponentType;
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
                : img && React.createElement(img, { className: cl.submit__button_icon })
            }
            {text}
        </button>
    );
};

export default SubmitButton;