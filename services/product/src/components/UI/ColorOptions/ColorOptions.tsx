import React from 'react';
import cl from './ColorOptions.module.scss'

const ColorOptions = () => {
    return (
        <div className={cl.colorOptions}>
                <button className={`${cl.colorButton} ${cl.colorBlack} ${cl.selected}`}></button>
                <button className={`${cl.colorButton} ${cl.colorGray}`}></button>
                <button className={`${cl.colorButton} ${cl.colorBrown}`}></button>
                <button className={`${cl.colorButton} ${cl.colorNavy}`}></button>
            </div>
    );
};

export default ColorOptions;