import React from 'react';
import cl from './PriceInput.module.scss'

const PriceInput = ({placeholder, value, onChange}) => {
    return (
        <div className={cl.price__input}>
            <div className={cl.price__placeholder}> {placeholder} </div>
            <input 
                type="number"
                value={value}
                min={100}
                max={5000}
                onChange={onChange}
                className={cl.price__enter}
            ></input>
        </div>
        
    );
};

export default PriceInput;

