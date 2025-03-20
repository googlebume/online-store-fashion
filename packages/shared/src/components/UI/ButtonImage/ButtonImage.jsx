import React from 'react';
import cl from './ButtonImage.module.scss'

const ButtonImage = ({img, onClick}) => {
    return (
        <button className={cl.button} onClick={onClick}>
            <img 
            src={img} 
            alt="Button" 
            className={cl.button__image}/>
        </button>
    );
};

export default ButtonImage;