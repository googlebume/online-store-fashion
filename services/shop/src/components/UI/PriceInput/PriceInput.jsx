import React from 'react';
import cl from './PriceInput.module..scss'

const PriceInput = ({placeholder, value}) => {
    return (
        <div className={cl.price__input}>
            <div className={cl.price__placeholder}> {placeholder} </div>
            <input 
                type="number"
                defaultValue={value}
                min={100}
                max={5000}
                className={cl.price__enter}
            ></input>
        </div>
        
    );
};

export default PriceInput;