import React from 'react';
import cl from './ButtonImage.module.scss'

const ButtonImage = ({img}) => {
    return (
        <button className={cl.button}>
            <img 
            src={img} 
            alt="Button" 
            className={cl.button__image}/>
        </button>
    );
};

export default ButtonImage;