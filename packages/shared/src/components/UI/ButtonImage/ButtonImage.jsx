import React from 'react';
import cl from './ButtonImage.module.scss'

const ButtonImage = ({ img, onClick, width='24px' }) => {
    return (
        <button className={cl.button} onClick={onClick} style={{ 'maxWidth': width }}>
            {img && typeof img === 'string'
                ? <img src={img} alt="" className={cl.submit__button_icon} />
                : React.isValidElement(img)
                    ? img
                    : typeof img === 'function'
                        ? React.createElement(img, { className: cl.button__image })
                        : null
            }
        </button>
    );
};

export default ButtonImage;