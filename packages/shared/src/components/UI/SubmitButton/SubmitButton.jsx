import React from 'react';
import cl from './SubmitButton.module.scss'

const SubmitButton = ({text}) => {
    return (
        <button className={cl.submit__button}> {text} </button>
    );
};

export default SubmitButton;