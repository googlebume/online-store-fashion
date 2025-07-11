import React from 'react';
import cl from './ButtonImage.module.scss'

const ButtonImage = ({ img, onClick, width }) => {
    return (
        <button className={cl.button} onClick={onClick} style={{ 'maxWidth': width }}>
            {typeof img === 'string' ? (
                <img src={img} alt="Button" className={cl.button__image} />
            ) : (
                React.isValidElement(img) ? img : null
            )}
        </button>
    );
};

export default ButtonImage;