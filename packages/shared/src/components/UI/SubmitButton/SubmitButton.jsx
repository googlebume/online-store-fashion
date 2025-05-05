import React from 'react';
import cl from './SubmitButton.module.scss'

const SubmitButton = ({ text, onClick }) => {
    return (
        <button
            className={cl.submit__button}
            onClick={onClick}
        > {text} </button>
    );
};

export default SubmitButton;